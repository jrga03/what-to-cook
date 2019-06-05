const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

const RecipeSchema = new Schema({
    name: { type: String },
    description: { type: String },
    ingredients: [{
        type: Schema.Types.ObjectId,
        ref: 'ingredient'
    }],
    tags: [{ type: String }]
});

RecipeSchema.statics.addIngredientToRecipe = async ( ingredientIds, recipeId ) => {
    const Ingredient = mongoose.model( 'ingredient' );
    const Recipe = mongoose.model( 'recipe' );

    try {
        const recipe = await Recipe.findById( recipeId ).exec();
        const ingredients = await Ingredient.find({ _id: { $in: ingredientIds }});

        recipe.ingredients.addToSet( ...ingredients );
        const promises = [recipe.save()];

        for ( const ingredientId of ingredientIds ) {
            // eslint-disable-next-line no-await-in-loop
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

RecipeSchema.statics.findIngredients = async ( ingredientIds ) => {
    const Ingredient = mongoose.model( 'ingredient' );

    try {
        const ingredients = await Ingredient.find({ _id: { $in: ingredientIds }})
        return ingredients;
    } catch ( error ) {
        throw error;
    }
}

RecipeSchema.statics.editRecipe = async ({ id, ...args }) => {
    const Recipe = mongoose.model( 'recipe' );

    try {
        const recipe = await Recipe.findOneAndUpdate({ id }, args, { new: true, upsert: true });
        return recipe;
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
