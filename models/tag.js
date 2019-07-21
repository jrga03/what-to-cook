const mongoose = require( 'mongoose' );
const { Schema } = mongoose;

const TagSchema = new Schema({
    recipes: [{
        type: Schema.Types.ObjectId,
        ref: 'recipe'
    }],
    name: { type: String }
});

TagSchema.statics.findRecipes = async ( recipeIds ) => {
    const Recipe = mongoose.model( 'recipe' );

    try {
        const recipes = await Recipe.find({ _id: { $in: recipeIds }})
        return recipes;
    } catch ( error ) {
        throw error;
    }
}

TagSchema.statics.batchAdd = async ( tagNames ) => {
    const Tag = mongoose.model( 'tag' );

    try {
        const existingTags = await Tag.find({ name: { $in: tagNames } });
        const existingTagsMap = new Map();
        existingTags.forEach(( tag ) => existingTagsMap.set( tag.name, tag.name ))

        const newTags = tagNames.reduce(( tagArray, tag ) => {
            if ( !existingTagsMap.has( tag ) ) {
                tagArray.push({ name: tag });
            }
            return tagArray;
        }, []);

        let tags = [];
        if ( newTags.length > 0 ) {
            tags = await Tag.insertMany( newTags );
        }

        return tags;
    } catch ( error ) {
        throw error;
    }
}

TagSchema.pre('save', async function( next ) {
    const Tag = mongoose.model( 'tag' );

    const tag = await Tag.find({ name: this.name });
    if ( tag.length > 0 ) {
        next( new Error( 'Tag already exists!' ) )
    } else {
        next();
    }
});

mongoose.model( 'tag', TagSchema );