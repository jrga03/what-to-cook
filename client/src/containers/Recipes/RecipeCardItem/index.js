import React from 'react';
import PropTypes from 'prop-types';

import { RECIPE_CARD_GUTTER_SIZE } from '../../../constants';
import RecipeCard from '../../../components/RecipeCard';

/**
 * RecipeCardItem component
 */
function RecipeCardItem({ data, index, style, likedRecipes }) {
    const {
        id,
        name,
        photo,
        description,
        tags
    } = data[ index ];
    const thumbnail = photo.replace( '/image/upload', '/image/upload/t_media_lib_thumb' );

    const liked = likedRecipes && likedRecipes.has( id );

    return (
        <RecipeCard
            style={{
                ...style,
                top: style.top + RECIPE_CARD_GUTTER_SIZE,
                height: style.height - RECIPE_CARD_GUTTER_SIZE
            }}
            id={ id }
            name={ name }
            photo={ thumbnail }
            description={ description }
            tags={ tags }
            liked={ liked }
        />
    );
}

RecipeCardItem.propTypes = {
    data: PropTypes.arrayOf( PropTypes.object ),
    index: PropTypes.number,
    style: PropTypes.object,
    likedRecipes: PropTypes.any // `Set` (not yet available in prop-types)
}

export default RecipeCardItem;