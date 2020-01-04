import React, { forwardRef } from 'react';
import { Helmet } from 'react-helmet';
// import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { FixedSizeList as List } from 'react-window';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';

import { RECIPE_CARD_GUTTER_SIZE } from '../../constants';
import Loader from '../../components/Loader';
import RecipeCard from '../../components/RecipeCard';
import { useWindowSize, useHeaderHeight } from '../../utils/hooks';

import { LoaderWrapper, Wrapper } from './styles';

const GET_RECIPES = gql`
    {
        recipes {
            id
            name
            description
            photo
            ingredients {
                quantity
                ingredient {
                    id
                    name
                }
            }
            tags {
                id
                name
            }
        }
    }
`;

/**
 * RecipeCardItem component
 */
function RecipeCardItem({ data, index, style }) {
    const {
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
            name={ name }
            photo={ thumbnail || 'https://res.cloudinary.com/what-to-cook/image/upload/t_media_lib_thumb/v1576648639/sample.jpg' } // TODO:
            description={ description }
            tags={ tags }
        />
    );
}

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
 * Recipes component
 */
function Recipes() {
    const { data, loading } = useQuery( GET_RECIPES, { pollInterval: 60000 });
    const windowSize = useWindowSize();
    const headerHeight = useHeaderHeight();

    /**
     * Fetches ID for list item
     * @param {number} index - Item index
     * @param {object[]} data - Item list
     */
    function getKey( index, recipes ) {
        return recipes[ index ].id;
    }

    const listWidth = Math.min( windowSize.width, 600 ) - ( RECIPE_CARD_GUTTER_SIZE * 2 );
    const computedItemSize = listWidth * 0.4; // one-third of list width
    const itemSize = Math.min( computedItemSize, 150 );
    const listHeight = windowSize.height - headerHeight - 52;

    return (
        <Wrapper>
            <Helmet>
                <title>What To Cook? - Recipes</title>
                <meta name="description" content="Recipe List" />
            </Helmet>
            <Input
                className="search-input"
                fullWidth
                color="primary"
                placeholder="Search"
                startAdornment={
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                }
            />
            { loading ? (
                <LoaderWrapper height={ listHeight }>
                    <Loader />
                </LoaderWrapper>
            ) : (
                <List
                    height={ listHeight }
                    width={ listWidth }
                    itemCount={ data.recipes.length }
                    itemSize={ itemSize }
                    itemData={ data.recipes }
                    itemKey={ getKey }
                    innerElementType={ innerElementType }
                >
                    { RecipeCardItem }
                </List>
            ) }
        </Wrapper>
    );
}

export default Recipes;