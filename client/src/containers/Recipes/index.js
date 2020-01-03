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
        description
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

    if ( loading ) {
        return (
            <LoaderWrapper>
                <Loader />
            </LoaderWrapper>
        );
    }

    /**
     * Fetches ID for list item
     * @param {number} index - Item index
     * @param {object[]} data - Item list
     */
    function getKey( index, recipes ) {
        return recipes[ index ].id;
    }

    const width = windowSize.width - ( RECIPE_CARD_GUTTER_SIZE * 2 );
    const maxSize = 200;
    const computedSize = width * 0.3; // one-third of screen width
    const itemSize = computedSize < maxSize ? computedSize : maxSize;
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
            <List
                height={ listHeight }
                width={ width }
                itemCount={ data.recipes.length }
                itemSize={ itemSize }
                itemData={ data.recipes }
                itemKey={ getKey }
                innerElementType={ innerElementType }
            >
                { RecipeCardItem }
            </List>
        </Wrapper>
    );
}

export default Recipes;