import React, { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { FixedSizeList as List, areEqual } from 'react-window';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';

import { RECIPE_CARD_GUTTER_SIZE, LIKED_RECIPES } from '../../constants';

import {
    useWindowSize,
    useLocalStorage
} from '../../utils/hooks';

import RecipeCardItem from './RecipeCardItem';

import { CenterItemWrapper } from './styles';

const MemoizedRecipeCardItem = memo( RecipeCardItem, areEqual );

const innerElementType = forwardRef(({ style, ...rest }, ref) => (
    <div
        ref={ ref }
        style={{
            ...style,
            paddingTop: RECIPE_CARD_GUTTER_SIZE
        }}
        { ...rest }
    />
));

/**
 * RecipeList component
 */
function RecipeList({ listHeight, recipes }) {
    const history = useHistory();

    const [likedRecipes] = useLocalStorage( LIKED_RECIPES, [] );
    const likedRecipesSet = new Set( likedRecipes );

    const windowSize = useWindowSize();

    /**
     * Fetches ID for list item
     * @param {number} index - Item index
     * @param {object[]} data - Item list
     */
    function getKey( index, recipes ) {
        return recipes[ index ].id;
    }

    /**
     * Returns function that redirects page to provided route
     * @param {string} to - Route path
     * @returns {function}
     */
    function handleRouteChange( to ) {
        return function() {
            history.push( to );
        }
    }

    const listWidth = Math.min( windowSize.width, 600 ) - ( RECIPE_CARD_GUTTER_SIZE * 2 );
    const computedItemSize = listWidth * 0.4; // one-third of list width
    const itemSize = Math.min( computedItemSize, 150 );

    return recipes.length === 0 ? (
        <CenterItemWrapper height={ listHeight }>
            <Typography variant="body2" paragraph>
                No recipe available
            </Typography>
            <Button
                color="primary"
                variant="outlined"
                onClick={ handleRouteChange( '/recipe/add' ) }
            >
                Add a Recipe
            </Button>
        </CenterItemWrapper>
    ) : (
        <Fade in>
            <List
                height={ listHeight }
                width={ listWidth }
                itemCount={ recipes.length }
                itemSize={ itemSize }
                itemData={ recipes }
                itemKey={ getKey }
                innerElementType={ innerElementType }
            >
                { ( props ) => (
                    <MemoizedRecipeCardItem
                        { ...props }
                        likedRecipes={ likedRecipesSet }
                    />
                ) }
            </List>
        </Fade>
    );
}

RecipeList.propTypes = {
    listHeight: PropTypes.number.isRequired,
    recipes: PropTypes.arrayOf( PropTypes.object ).isRequired
}

export default RecipeList;