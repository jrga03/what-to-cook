import React from 'react';
import PropTypes from 'prop-types';

import { RECIPE_CARD_GUTTER_SIZE } from '../../../constants';
import RecipeCard from '../../../components/RecipeCard';

/**
 * RecipeCardItem component
 */
function RecipeCardItem({ data, index, style }) {
    const {
        id,
        name,
        photo,
        description,
        tags
    } = data[ index ];

    // TODO: remove if all recipes have photos
    let thumbnail = photo;
    if ( thumbnail ) {
        thumbnail = photo.replace( '/image/upload', '/image/upload/t_media_lib_thumb' );
    }
    // TODO:

    return (
        <RecipeCard
            style={{
                ...style,
                top: style.top + RECIPE_CARD_GUTTER_SIZE,
                height: style.height - RECIPE_CARD_GUTTER_SIZE
            }}
            id={ id }
            name={ name }
            photo={ thumbnail || 'https://res.cloudinary.com/what-to-cook/image/upload/t_media_lib_thumb/v1576648639/sample.jpg' } // TODO:
            description={ description }
            tags={ tags }
        />
    );
}

RecipeCardItem.propTypes = {
    data: PropTypes.arrayOf( PropTypes.object ),
    index: PropTypes.number,
    style: PropTypes.object
}

export default RecipeCardItem;