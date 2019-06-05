const mongoose = require( 'mongoose' );
const { Schema } = mongoose;

const IngredientSchema = new Schema({
    recipes: [{
        type: Schema.Types.ObjectId,
        ref: 'recipe'
    }],
    name: { type: String }
});

IngredientSchema.statics.findRecipes = async ( recipeIds ) => {
    const Recipe = mongoose.model( 'recipe' );

    try {
        const recipes = await Recipe.find({ _id: { $in: recipeIds }})
        return recipes;
    } catch ( error ) {
        throw error;
    }
}

mongoose.model( 'ingredient', IngredientSchema );