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

IngredientSchema.statics.batchAdd = async ( ingredientNames ) => {
    const Ingredient = mongoose.model( 'ingredient' );

    try {
        const existingIngredients = await Ingredient.find({ name: { $in: ingredientNames } });
        const existingIngredientsMap = new Map();
        existingIngredients.forEach(( ingredient ) => existingIngredientsMap.set( ingredient.name, ingredient.name ));

        const newIngredients = ingredientNames.reduce(( ingredientArray, ingredient ) => {
            if ( !existingIngredientsMap.has( ingredient ) ) {
                ingredientArray.push({ name: ingredient });
            }
            return ingredientArray;
        }, []);

        let ingredients = [];
        if ( newIngredients.length > 0 ) {
            ingredients = await Ingredient.insertMany( newIngredients );
        }
        return ingredients;
    } catch ( error ) {
        throw error;
    }
}

IngredientSchema.statics.batchDelete = async ( ingredientIds ) => {
    const Ingredient = mongoose.model( 'ingredient' );

    try {
        await Ingredient.deleteMany({ _id: { $in: ingredientIds } });
        return Ingredient.find({});
    } catch ( error ) {
        throw error;
    }
}

IngredientSchema.pre('save', async function( next ) {
    const Ingredient = mongoose.model( 'ingredient' );

    const ingredient = await Ingredient.find({ name: this.name });
    if ( ingredient.length > 0 ) {
        next( new Error( 'Ingredient already exists!' ) )
    } else {
        next();
    }
});

mongoose.model( 'ingredient', IngredientSchema );