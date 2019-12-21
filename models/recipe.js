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

RecipeSchema.statics.findRecipeByTags = async ( tagNames ) => {
    const Recipe = mongoose.model( 'recipe' );

    try {
        const recipes = await Recipe.find({ tags: { $in: tagNames }}) // TODO: something is wrong! Find intersection of tags
        return recipes;
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

RecipeSchema.statics.addRecipe = async ({ name, description = '', photo, ingredients = [], instructions, tags = [], newTags = []}) => {
    const Recipe = mongoose.model( 'recipe' );

    try {
        const recipe = new Recipe({ name, description, photo, ingredients, instructions, tags });

        const promises = [recipe.save()];

        if ( tags.length > 0 ) {
            const Tag = mongoose.model( 'tag' );
            promises.push( Tag.updateMany({ _id: { $in: tags } }, { $addToSet: { recipes: recipe._id } }));
        }

        if ( newTags.length > 0 ) {
            const Tag = mongoose.model( 'tag' );
            const newTagsWithRecipe = newTags.map(( tag ) => ({ name: tag, recipes: [recipe._id] }))
            promises.push( Tag.insertMany( newTagsWithRecipe ));
        }

        if ( ingredients.length > 0 ) {
            const Ingredient = mongoose.model( 'ingredient' );
            const ingredientIds = ingredients.map(({ ingredient }) => ingredient );
            promises.push( Ingredient.updateMany({ _id: { $in: ingredientIds } }, { $addToSet: { recipes: recipe._id } }));
        }

        const [updatedRecipe] = await Promise.all( promises );

        return updatedRecipe;
    } catch ( error ) {
        throw error;
    }
}

RecipeSchema.statics.editRecipe = async ({ id, ...args }) => {
    const Recipe = mongoose.model( 'recipe' );

    try {
        const recipe = await Recipe.findById( id );

        Object.keys( args ).forEach(( key ) => {
            recipe[ key ] = args[ key ];
        });

        const promises = [recipe.save()];

        if ( args.tags && args.tags.length > 0 ) {
            const Tag = mongoose.model( 'tag' );
            promises.push( Tag.updateMany({ _id: { $in: args.tags } }, { $addToSet: { recipes: id } }));
        }

        if ( args.newTags.length > 0 ) {
            const Tag = mongoose.model( 'tag' );
            const newTagsWithRecipe = args.newTags.map(( tag ) => ({ name: tag, recipes: [id] }))
            promises.push( Tag.insertMany( newTagsWithRecipe ));
        }

        if ( args.ingredients && args.ingredients.length > 0 ) {
            const Ingredient = mongoose.model( 'ingredient' );
            const ingredientIds = args.ingredients.map(({ ingredient }) => ingredient );
            promises.push( Ingredient.updateMany({ _id: { $in: ingredientIds } }, { $addToSet: { recipes: id } }));
        }

        const [updatedRecipe] = await Promise.all( promises );

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
