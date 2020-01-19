import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';

import Loader from '../../components/Loader';
import RecipeList from '../../components/RecipeList';

import {
    useWindowSize,
    useHeaderHeight,
    useDebounce
} from '../../utils/hooks';

import TagList from './TagList';

import { CenterItemWrapper, Wrapper } from './styles';

const GET_RECIPES = gql`
    query recipes( $search: String, $tags: [ID!] ) {
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

/**
 * Recipes component
 */
function Recipes() {
    const { search } = useLocation();
    const urlQuery = new URLSearchParams( search );
    const category = urlQuery.get( 'category' );
    const categories = new Set( category ? category.split( ',' ) : []);

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
                <RecipeList
                    listHeight={ listHeight }
                    recipes={ recipes }
                />
            ) }
        </Wrapper>
    );
}

export default Recipes;