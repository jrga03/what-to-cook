const { model } = require( 'mongoose' );
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
    GraphQLInputObjectType,
    GraphQLString
} = require( 'graphql' );
const Ingredient = model( 'ingredient' );
const Recipe = model( 'recipe' );

const IngredientInputType = new GraphQLInputObjectType({
    name: "IngredientInputType",
    description: "Input ingredient payload",
    fields: () => ({
        id: { type: new GraphQLNonNull( GraphQLID ) },
        name: { type: new GraphQLNonNull( GraphQLString ) }
    })
});

const IngredientType = new GraphQLObjectType({
    name: 'IngredientType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        recipes: {
            type: GraphQLList( RecipeType ),
            description: '',
            async resolve( parentValue ) {
                const recipes = await Ingredient.findRecipes( parentValue.recipes );
                return recipes;
            }
        }
    })
});

const RecipeType = new GraphQLObjectType({
    name: 'RecipeType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        ingredients: {
            type: GraphQLList( GraphQLNonNull( IngredientType )),
            description: '',
            async resolve( parentValue ) {
                const ingredients = await Recipe.findIngredients( parentValue.ingredients );
                return ingredients;
            }
        }
    })
});

const query = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        recipes: {
            type: GraphQLList( RecipeType ),
            resolve() {
                return Recipe.find({});
            }
        },
        recipe: {
            type: RecipeType,
            args: {
                id: { type: GraphQLNonNull( GraphQLID ) }
            },
            async resolve( parentValue, { id }) {
                const recipe = await Recipe.findById( id )
                return recipe;
            }
        },
        ingredients: {
            type: GraphQLList( IngredientType ),
            resolve() {
                return Ingredient.find({});
            }
        },
        ingredient: {
            type: IngredientType,
            args: {
                id: { type: GraphQLNonNull( GraphQLID ) }
            },
            resolve( parentValue, { id }) {
                return Ingredient.findById( id );
            }
        }
    })
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addRecipe: {
            type: RecipeType,
            args: {
                name: { type: GraphQLNonNull( GraphQLString ) },
                description: { type: GraphQLString },
                ingredients: { type: GraphQLList( GraphQLNonNull( IngredientInputType )) },
                tags: { type: GraphQLList( GraphQLNonNull( GraphQLString )) }
            },
            resolve( parentValue, { name = '', description = '', ingredients = []}) {
                return ( new Recipe({ name, description, ingredients })).save()
            }
        },
        editRecipe: {
            type: RecipeType,
            args: {
                id: { type: GraphQLNonNull( GraphQLID ) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                ingredients: { type: GraphQLList( GraphQLNonNull( IngredientInputType )) },
                tags: { type: GraphQLList( GraphQLNonNull( GraphQLString )) }
            },
            resolve( parentValue, args ) {
                const recipe = Recipe.editRecipe( args );
                return recipe;
            }
        },
        addIngredient: {
            type: IngredientType,
            args: {
                name: { type: GraphQLNonNull( GraphQLString ) }
            },
            resolve( parentValue, { name }) {
                return ( new Ingredient({ name })).save()
            }
        },
        addIngredientToRecipe: {
            type: RecipeType,
            args: {
                ingredientIds: { type: GraphQLNonNull( GraphQLList( GraphQLNonNull( GraphQLID ))) },
                recipeId: { type: GraphQLNonNull( GraphQLID ) }
            },
            async resolve( parentValue, { ingredientIds, recipeId }) {
                return Recipe.addIngredientToRecipe( ingredientIds, recipeId );
            }
        },
        deleteRecipe: {
            type: RecipeType,
            args: {
                id: { type: GraphQLNonNull( GraphQLID ) }
            },
            resolve( parentValue, { id }) {
                return Recipe.remove({ _id: id });
            }
        },
        deleteIngredientFromRecipe: {
            type: IngredientType,
            args: {
                id: { type: GraphQLNonNull( GraphQLID ) },
                recipeId: { type: GraphQLNonNull( GraphQLID ) }
            },
            resolve( parentValue, { id, recipeId }) {
                return Recipe.removeIngredient( recipeId, id );
            }
        }
    })
});

module.exports = new GraphQLSchema({
    query,
    mutation
});
