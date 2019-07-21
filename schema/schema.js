const { model } = require( 'mongoose' );
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
    GraphQLString
} = require( 'graphql' );
const Ingredient = model( 'ingredient' );
const Recipe = model( 'recipe' );
const Tag = model( 'tag' );

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
            type: GraphQLList( IngredientType ),
            description: '',
            async resolve( parentValue ) {
                const ingredients = await Recipe.findIngredients( parentValue.ingredients );
                return ingredients;
            }
        },
        instructions: { type: GraphQLString },
        tags: {
            type: GraphQLList( TagType ),
            description: '',
            async resolve( parentValue ) {
                const tags = await Recipe.findTags( parentValue.tags );
                return tags;
            }
        }
    })
});

const TagType = new GraphQLObjectType({
    name: 'TagType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        recipes: {
            type: GraphQLList( RecipeType ),
            description: '',
            async resolve( parentValue ) {
                const recipes = await Tag.findRecipes( parentValue.recipes );
                return recipes;
            }
        }
    })
});

const query = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        recipes: {
            type: GraphQLList( RecipeType ),
            args: {
                tags: { type: GraphQLList( GraphQLNonNull( GraphQLString)) }
            },
            async resolve( parentValue, { tags = []}) {
                if ( tags.length > 0 ) {
                    const recipes = await Recipe.findRecipeByTags( tags ); // TODO: fix method
                    return recipes;
                }
                return Recipe.find({});
            }
        },
        recipe: {
            type: RecipeType,
            args: {
                id: { type: GraphQLNonNull( GraphQLID ) }
            },
            async resolve( parentValue, { id }) {
                const recipe = await Recipe.findById( id );
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
        },
        tags: {
            type: GraphQLList( TagType ),
            resolve() {
                return Tag.find({});
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
                ingredients: { type: GraphQLList( GraphQLID ) },
                instructions: { type: GraphQLNonNull( GraphQLString ) },
                tags: { type: GraphQLList( GraphQLID ) }
            },
            resolve( parentValue, args ) {
                return Recipe.addRecipe( args );
            }
        },
        editRecipe: {
            type: RecipeType,
            args: {
                id: { type: GraphQLNonNull( GraphQLID ) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                ingredients: { type: GraphQLList( GraphQLID ) },
                instructions: { type: GraphQLNonNull( GraphQLString ) },
                tags: { type: GraphQLList( GraphQLID ) }
            },
            resolve( parentValue, args ) {
                return Recipe.editRecipe( args );
            }
        },
        addIngredient: {
            type: IngredientType,
            args: {
                name: { type: GraphQLNonNull( GraphQLString ) }
            },
            resolve( parentValue, { name }) {
                return ( new Ingredient({ name: name.toLowerCase() })).save();
            }
        },
        addIngredients: {
            type: GraphQLList( IngredientType ),
            args: {
                ingredients: { type: GraphQLNonNull( GraphQLList( GraphQLNonNull( GraphQLString ))) }
            },
            resolve( parentValue, { ingredients }) {
                const ingredientNames = ingredients.map(( ingredient ) => ingredient.toLowerCase());
                return Ingredient.batchAdd( ingredientNames );
            }
        },
        deleteIngredients: {
            type: GraphQLList( IngredientType ),
            args: {
                ingredients: { type: GraphQLList( GraphQLNonNull( GraphQLID )) }
            },
            resolve( parentValue, { ingredients }) {
                return Ingredient.batchDelete( ingredients );
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
        },
        addTag: {
            type: TagType,
            args: {
                name: { type: GraphQLNonNull( GraphQLString ) }
            },
            resolve( parentValue, { name = '' }) {
                return ( new Tag({ name: name.toLowerCase() })).save();
            }
        },
        deleteTag: {
            type: TagType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString }
            },
            resolve( parentValue, { name, id }) {
                if ( id ) {
                    return Tag.remove({ _id: id });
                }
                return Tag.remove({ name: name.toLowerCase() });
            }
        }
    })
});

module.exports = new GraphQLSchema({
    query,
    mutation
});
