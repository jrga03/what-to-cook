const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

const RecipeSchema = new Schema({
    name: { type: String },
    description: { type: String },
    photo: { type: String },
    ingredients: [{
        quantity: String,
        ingredient: {
            type: Schema.Types.ObjectId,
            ref: 'ingredient'
        }
    }],
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'tag'
    }],
    instructions: { type: String }
});

/**
 *
 * Query methods
 *
 */
RecipeSchema.statics.findIngredients = async ( ingredientIds ) => {
    const Ingredient = mongoose.model( 'ingredient' );

    try {
        const ingredients = await Ingredient.find({ _id: { $in: ingredientIds }})
        return ingredients;
    } catch ( error ) {
        throw error;
    }
}

RecipeSchema.statics.findTags = async ( tagIds ) => {
    const Tag = mongoose.model( 'tag' );

    try {
        const tags = await Tag.find({ _id: { $in: tagIds }})
        return tags;
    } catch ( error ) {
        throw error;
    }
}

/**
 *
 * Mutation methods
 *
 */
RecipeSchema.statics.addIngredientToRecipe = async ( ingredientIds, recipeId ) => {
    const Ingredient = mongoose.model( 'ingredient' );
    const Recipe = mongoose.model( 'recipe' );

    try {
        const recipe = await Recipe.findById( recipeId ).exec();
        const ingredients = await Ingredient.find({ _id: { $in: ingredientIds }});

        recipe.ingredients.addToSet( ...ingredients );
        const promises = [recipe.save()];

        for ( const ingredientId of ingredientIds ) {
            const ingredient = await Ingredient.findById( ingredientId ).exec();
            ingredient.recipes.addToSet( recipe );
            promises.push( ingredient.save());
        }

        const [updated] = await Promise.all( promises );

        return updated;
    } catch ( error ) {
        throw error;
    }
}

/**
 * Saves new ingredients and tags
 * @param {object} param
 * @param {object[]} param.ingredients
 * @param {string[]} param.tags
 * @returns {object}
 */
async function saveNewIngredientsAndTags({ ingredients, tags }) {
    const Ingredient = mongoose.model( 'ingredient' );
    const Tag = mongoose.model( 'tag' );
    const newIngredientsWithRecipe = ingredients.map(({ ingredient }) => ({ name: ingredient, recipes: [] }));
    const newTagsWithRecipe = tags.map(( tag ) => ({ name: tag, recipes: [] }));

    const [ savedNewIngredients, savedNewTags ] = await Promise.all([
        ingredients.length > 0 && Ingredient.insertMany( newIngredientsWithRecipe ),
        tags.length > 0 && Tag.insertMany( newTagsWithRecipe )
    ]);

    return {
        ingredients: savedNewIngredients || [],
        tags: savedNewTags || []
    };
}

RecipeSchema.statics.addRecipe = async ({ name, description = '', photo, ingredients = [], newIngredients = [], instructions, tags = [], newTags = []}) => {
    const Recipe = mongoose.model( 'recipe' );

    try {
        const saved = await saveNewIngredientsAndTags({
            ingredients: newIngredients,
            tags: newTags
        });

        const mergedIngredients = ingredients.concat(
            newIngredients.map(({ quantity, ingredient }) => ({
                quantity,
                ingredient: saved.ingredients.find(({ name }) => name === ingredient )._id
            }) )
        );

        const mergedTags = tags.concat(
            saved.tags.map(( id ) => id )
        );

        const recipe = new Recipe({
            name,
            description,
            photo,
            ingredients: mergedIngredients,
            instructions,
            tags: mergedTags
        });

        function saveIngredients() {
            const Ingredient = mongoose.model( 'ingredient' );
            const ingredientIds = mergedIngredients.map(({ ingredient }) => ingredient );
            return Ingredient.updateMany({ _id: { $in: ingredientIds } }, { $addToSet: { recipes: recipe._id } });
        }

        function saveTags() {
            const Tag = mongoose.model( 'tag' );
            return Tag.updateMany({ _id: { $in: mergedTags } }, { $addToSet: { recipes: recipe._id } });
        }

        const [newRecipe] = await Promise.all([
            recipe.save(),
            mergedIngredients.length > 0 && saveIngredients(),
            mergedTags.length > 0 && saveTags()
        ]);

        return newRecipe;
    } catch ( error ) {
        throw error;
    }
}

RecipeSchema.statics.editRecipe = async ({ id, ...args }) => {
    const Recipe = mongoose.model( 'recipe' );

    try {
        const { ingredients = [], newIngredients = [], tags = [], newTags = [], ...rest } = args;

        const saved = await saveNewIngredientsAndTags({
            ingredients: newIngredients,
            tags: newTags
        });

        const mergedIngredients = ingredients.concat(
            newIngredients.map(({ quantity, ingredient }) => ({
                quantity,
                ingredient: saved.ingredients.find(({ name }) => name === ingredient )._id
            }) )
        );

        const mergedTags = tags.concat(
            saved.tags.map(( id ) => id )
        );

        const recipe = await Recipe.findById( id );

        Object.keys( rest ).forEach(( key ) => {
            recipe[ key ] = rest[ key ];
        });

        recipe.ingredients = mergedIngredients;
        recipe.tags = mergedTags;

        function saveIngredients() {
            const Ingredient = mongoose.model( 'ingredient' );
            const ingredientIds = mergedIngredients.map(({ ingredient }) => ingredient );
            return Ingredient.updateMany({ _id: { $in: ingredientIds } }, { $addToSet: { recipes: id } });
        }

        function saveTags() {
            const Tag = mongoose.model( 'tag' );
            return Tag.updateMany({ _id: { $in: mergedTags } }, { $addToSet: { recipes: id } });
        }

        const [updatedRecipe] = await Promise.all([
            recipe.save(),
            mergedIngredients.length > 0 && saveIngredients(),
            mergedTags.length > 0 && saveTags()
        ]);

        return updatedRecipe;
    } catch ( error ) {
        throw error;
    }
}

RecipeSchema.statics.removeIngredient = async ( recipeId, ingredientId ) => {
    const Recipe = mongoose.model( 'recipe' );
    const Ingredient = mongoose.model( 'ingredient' );

    try {
        const recipe = await Recipe.findById( recipeId ).exec();
        const ingredient = await Ingredient.findById( ingredientId ).exec();
        recipe.ingredients.id( ingredientId ).remove();
        ingredient.recipes.id( recipeId ).remove();

        const [updated] = await Promise.all([
            ingredient.save(),
            recipe.save()
        ]);

        return updated;
    } catch ( error ) {
        throw error;
    }
}

mongoose.model( 'recipe', RecipeSchema );
