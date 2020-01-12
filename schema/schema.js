const { model } = require( 'mongoose' );
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInputObjectType
} = require( 'graphql' );
const Fuse = require( 'fuse.js' );

const Ingredient = model( 'ingredient' );
const Recipe = model( 'recipe' );
const Tag = model( 'tag' );

const options = {
    id: '',
    shouldSort: true,
    threshold: 0.5,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 2,
    keys: [
        {
            name: 'name',
            weight: 0.5
        },
        {
            name: 'description',
            weight: 0.05
        },
        {
            name: 'ingredients.ingredient.name',
            weight: 0.25
        },
        {
            name: 'tag.name',
            weight: 0.2
        }
    ]
};

const IngredientType = new GraphQLObjectType({
    name: 'IngredientType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        recipes: { type: GraphQLList( RecipeType ) }
    })
});

const RecipeIngredientType = new GraphQLObjectType({
    name: 'RecipeIngredient',
    fields: () => ({
        quantity: { type: GraphQLString },
        ingredient: { type: IngredientType }
    })
})

const RecipeType = new GraphQLObjectType({
    name: 'RecipeType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        photo: { type: GraphQLString },
        ingredients: { type: GraphQLList( RecipeIngredientType ) },
        instructions: { type: GraphQLString },
        tags: { type: GraphQLList( TagType ) }
    })
});

const TagType = new GraphQLObjectType({
    name: 'TagType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        recipes: { type: GraphQLList( RecipeType ) }
    })
});

const RecipeIngredientInput = new GraphQLInputObjectType({
    name: 'RecipeIngredientInput',
    fields: () => ({
        quantity: { type: GraphQLString },
        ingredient: { type: GraphQLID }
    })
})

const NewIngredientInput = new GraphQLInputObjectType({
    name: 'NewIngredientInput',
    fields: () => ({
        quantity: { type: GraphQLString },
        ingredient: { type: GraphQLString }
    })
})

const query = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        recipes: {
            type: GraphQLList( RecipeType ),
            args: {
                search: { type: GraphQLString },
                tags: { type: GraphQLList( GraphQLNonNull( GraphQLString ) ) }
            },
            async resolve( parentValue, { search = '', tags = []}) {
                let query = {};
                if ( tags.length > 0 ) {
                    query = { tags: { $all: tags }}
                }

                const recipes = await new Promise( function( resolve, reject ) {
                    try {
                        Recipe
                            .find( query )
                            .populate( 'tags' )
                            .exec( function( error, _recipes ) {
                                Ingredient.populate(
                                    _recipes,
                                    { path: 'ingredients.ingredient' },
                                    function( error, recipesWithPopulatedIngredients ) {
                                        resolve( recipesWithPopulatedIngredients );
                                    }
                                )
                            });
                    } catch ( error ) {
                        reject( error );
                    }
                });

                if ( search !== '' ) {
                    const fuse = new Fuse( recipes, options );
                    return fuse.search( search );
                }

                return recipes;
            }
        },
        recipe: {
            type: RecipeType,
            args: {
                id: { type: GraphQLNonNull( GraphQLID ) }
            },
            async resolve( parentValue, { id }) {
                const recipe = await new Promise( function( resolve, reject ) {
                    try {
                        Recipe
                            .findById( id )
                            .populate( 'tags' )
                            .exec( function( error, _recipes ) {
                                Ingredient.populate(
                                    _recipes,
                                    { path: 'ingredients.ingredient' },
                                    function( error, recipesWithPopulatedIngredients ) {
                                        resolve( recipesWithPopulatedIngredients );
                                    }
                                )
                            });
                    } catch ( error ) {
                        reject( error );
                    }
                });
                return recipe;
            }
        },
        ingredients: {
            type: GraphQLList( IngredientType ),
            resolve() {
                return Ingredient.find({}).populate( 'recipes' );
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
                return Tag.find({}).populate( 'recipes' );
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
                photo: { type: GraphQLNonNull( GraphQLString ) },
                ingredients: { type: GraphQLList( RecipeIngredientInput ) },
                newIngredients: { type: GraphQLList( NewIngredientInput ) },
                instructions: { type: GraphQLNonNull( GraphQLString ) },
                tags: { type: GraphQLList( GraphQLID ) },
                newTags: { type: GraphQLList( GraphQLString ) }
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
                photo: { type: GraphQLNonNull( GraphQLString ) },
                ingredients: { type: GraphQLList( RecipeIngredientInput ) },
                newIngredients: { type: GraphQLList( NewIngredientInput ) },
                instructions: { type: GraphQLNonNull( GraphQLString ) },
                tags: { type: GraphQLList( GraphQLID ) },
                newTags: { type: GraphQLList( GraphQLString ) }
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
        addTags: {
            type: GraphQLList( TagType ),
            args: {
                tags: { type: GraphQLNonNull( GraphQLList( GraphQLNonNull( GraphQLString ))) }
            },
            resolve( parentValue, { tags }) {
                const tagNames = tags.map(( tag ) => tag.toLowerCase());
                return Tag.batchAdd( tagNames );
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
                    return Tag.deleteOne({ _id: id });
                }
                return Tag.deleteOne({ name: name.toLowerCase() });
            }
        }
    })
});

module.exports = new GraphQLSchema({
    query,
    mutation
});
