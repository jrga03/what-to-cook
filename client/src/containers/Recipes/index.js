import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Fab from '@material-ui/core/Fab';
import Search from '@material-ui/icons/Search';
import get from 'lodash/get';

import Loader from '../../components/Loader';
import RecipeList from '../../components/RecipeList';

import {
    useWindowSize,
    useHeaderHeight,
    useDebounce
} from '../../utils/hooks';

import ChipList from './ChipList';

import { CenterItemWrapper, Wrapper } from './styles';

const GET_RECIPES = gql`
    query recipes( $search: String, $tags: [ID!], $ingredients: [ID!] ) {
        recipes( search: $search, tags: $tags, ingredients: $ingredients ) {
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

/**
 * Recipes component
 */
function Recipes() {
    const {
        search,
        state,
        pathname
    } = useLocation();
    const history = useHistory();

    const urlQuery = new URLSearchParams( search );
    const category = urlQuery.get( 'category' );
    const categories = new Set( category ? category.split( ',' ) : []);
    const ingredients = get( state, 'ingredients', [] );
    const selectedIngredients = get( state, 'selectedIngredients', []);

    const [ searchTerm, setSearchTerm ] = useState( '' );
    const [ selectedTags, setSelectedTags ] = useState( new Set([]));

    const debouncedSearchTerm = useDebounce( searchTerm, 300 );

    const variables = {
        search: debouncedSearchTerm || '',
        tags: Array.from( selectedTags ),
        ingredients: Array.from( selectedIngredients )
    };

    const {
        data: { recipes } = {},
        loading
    } = useQuery( GET_RECIPES, { variables, displayName: 'getRecipesQuery' });

    const {
        data: { tags: tagsData = [] } = {},
        loading: tagsLoading
    } = useQuery( GET_TAGS, { displayName: 'getTagsQuery' });

    let tags = [];
    if ( tagsData.length > 0 ) {
        const categories = new Set( category ? category.split( ',' ) : []);
        const categorizedTags = tagsData.reduce(( filtered, tag ) => {
            if ( categories.has( tag.name )) {
                filtered.first.push( tag );
            } else {
                filtered.last.push( tag );
            }

            return filtered;
        }, {
            first: [],
            last: []
        });

        tags = [
            ...categorizedTags.first,
            ...categorizedTags.last
        ];
    }

    const windowSize = useWindowSize();
    const headerHeight = useHeaderHeight();

    /**
     * Process data from `getTagsQuery`
     */
    useEffect(
        () => {
            const categories = new Set( category ? category.split( ',' ) : []);
            if ( tags.length > 0 ) {
                const selectedCategories = tags.reduce(( selected, { name, id }) => {
                    if ( categories.has( name ) ) {
                        selected.push( id );
                    }
                    return selected;
                }, []);

                setSelectedTags( new Set( selectedCategories ) )
            }
        },
        [ tags.length, category ] // eslint-disable-line react-hooks/exhaustive-deps
    );

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

    function goToIngredients() {
        history.push( '/ingredients' );
    }

    const isSearch = new RegExp( '/search' ).test( pathname );

    const hasIngredients = ingredients.length > 0;
    const SEARCH_INPUT_HEIGHT = 52;
    const TAGS_HEIGHT = 36;
    const INGREDIENTS_HEIGHT = hasIngredients ? 58 : 0;
    const listHeight = windowSize.height - headerHeight - SEARCH_INPUT_HEIGHT - TAGS_HEIGHT - INGREDIENTS_HEIGHT;

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
                <ChipList
                    type="tags"
                    items={ tags }
                    selectedTags={ selectedTags }
                    onClickTag={ handleOnClickTag }
                />
            ) }

            { hasIngredients && (
                <ChipList
                    type="ingredients"
                    items={ ingredients }
                />
            ) }

            { loading ? (
                <CenterItemWrapper height={ listHeight }>
                    <Loader />
                </CenterItemWrapper>
            ) : (
                <RecipeList
                    listHeight={ listHeight }
                    recipes={ recipes }
                />
            ) }

            { isSearch && (
                <Fab variant="extended" size="medium" onClick={ goToIngredients }>
                    <Search />
                    By Ingredient
                </Fab>
            ) }
        </Wrapper>
    );
}

export default Recipes;