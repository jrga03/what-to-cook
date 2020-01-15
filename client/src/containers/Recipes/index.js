import React, { forwardRef, useState, useEffect, memo } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { FixedSizeList as List, areEqual } from 'react-window';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';

import { RECIPE_CARD_GUTTER_SIZE, LIKED_RECIPES } from '../../constants';
import Loader from '../../components/Loader';

import {
    useWindowSize,
    useHeaderHeight,
    useDebounce,
    useLocalStorage
} from '../../utils/hooks';

import RecipeCardItem from './RecipeCardItem';
import TagList from './TagList';

import { CenterItemWrapper, Wrapper } from './styles';

const MemoizedRecipeCardItem = memo( RecipeCardItem, areEqual );

const GET_RECIPES = gql`
    query recipes( $search: String, $tags: [String!] ) {
        recipes( search: $search, tags: $tags ) {
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

const GET_TAGS = gql`
    {
        tags {
            id
            name
        }
    }
`;

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
    const { search } = useLocation();
    const history = useHistory();
    const urlQuery = new URLSearchParams( search );
    const category = urlQuery.get( 'category' );
    const categories = new Set( category ? category.split( ',' ) : []);

    const [likedRecipes] = useLocalStorage( LIKED_RECIPES, [] );
    const likedRecipesSet = new Set( likedRecipes );

    const [ searchTerm, setSearchTerm ] = useState( '' );
    const [ selectedTags, setSelectedTags ] = useState( new Set([]));

    const debouncedSearchTerm = useDebounce( searchTerm, 300 );

    const variables = {
        search: debouncedSearchTerm || '',
        tags: Array.from( selectedTags )
    };

    const {
        data: { recipes } = {},
        loading
    } = useQuery( GET_RECIPES, { variables, displayName: 'getRecipesQuery' });

    const {
        data: { tags } = {},
        loading: tagsLoading
    } = useQuery( GET_TAGS, { displayName: 'getTagsQuery' });

    const windowSize = useWindowSize();
    const headerHeight = useHeaderHeight();

    /**
     * Process data from `getTagsQuery`
     */
    useEffect(
        () => {
            if ( tags && categories.size > 0 ) {
                const selectedCategories = tags.reduce(( selected, { name, id }) => {
                    if ( categories.has( name ) ) {
                        selected.push( id );
                    }
                    return selected;
                }, []);

                setSelectedTags( new Set( selectedCategories ) )
            }
        },
        [tags] // eslint-disable-line react-hooks/exhaustive-deps
    );

    /**
     * Fetches ID for list item
     * @param {number} index - Item index
     * @param {object[]} data - Item list
     */
    function getKey( index, recipes ) {
        return recipes[ index ].id;
    }

    /**
     * On change handler for search input
     * @param {SyntethicEvent} event
     */
    function onSearchChange( event ) {
        setSearchTerm( event.target.value );
    }

    /**
     * On click handler for tag click
     * @param {string} id - Tag ID
     * @param {string} name - Tag name
     */
    function handleOnClickTag({ id, name }) {
        return function() {
            if ( categories.has( name ) ) return;

            const selectedTagsCopy = new Set( selectedTags );

            if ( selectedTagsCopy.has( id )) {
                selectedTagsCopy.delete( id );
            } else {
                selectedTagsCopy.add( id );
            }

            setSelectedTags( selectedTagsCopy );
        }
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
    const SEARCH_INPUT_HEIGHT = 52;
    const TAGS_HEIGHT = 36;
    const listHeight = windowSize.height - headerHeight - SEARCH_INPUT_HEIGHT - TAGS_HEIGHT;

    return (
        <Wrapper>
            <Helmet>
                <title>What To Cook? - Recipes</title>
                <meta name="description" content="Recipe List" />
            </Helmet>
            <Input
                value={ searchTerm }
                className="search-input"
                fullWidth
                color="primary"
                placeholder="Search"
                startAdornment={
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                }
                onChange={ onSearchChange }
            />

            { !tagsLoading && (
                <TagList
                    tags={ tags }
                    selectedTags={ selectedTags }
                    onClickTag={ handleOnClickTag }
                />
            ) }

            { loading ? (
                <CenterItemWrapper height={ listHeight }>
                    <Loader />
                </CenterItemWrapper>
            ) : (
                recipes.length === 0 ? (
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
                )
            )}
        </Wrapper>
    );
}

export default Recipes;