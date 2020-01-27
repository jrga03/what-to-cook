import React, { useState, useEffect, memo } from 'react';
import { useHistory } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import Fuse from 'fuse.js';
import { FixedSizeList as List, areEqual } from 'react-window';
import memoize from 'memoize-one';
import Fade from '@material-ui/core/Fade';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Grow from '@material-ui/core/Grow';
import Snackbar from '@material-ui/core/Snackbar';
import Search from '@material-ui/icons/Search';
import Check from '@material-ui/icons/Check';
import startCase from 'lodash/startCase';

import { useWindowSize, useHeaderHeight, useDebounce } from '../../utils/hooks';

import Loader from '../../components/Loader';

import {
    Wrapper,
    ContentWrapper,
    TOTAL_CONTAINER_PADDING
} from './styles';

const options = {
    id: '',
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['name']
};

const GET_INGREDIENTS = gql`
    {
        ingredients {
            id,
            name
        }
    }
`;

const Row = memo(({ data, index, style }) => {
    const { items, onClickItem, selectedItems } = data;
    const item = items[ index ];
    const selected = selectedItems.has( item.id );

    return (
        <ListItem button selected={ selected } style={ style } onClick={ onClickItem( item.id ) }>
            <ListItemText>{ startCase( item.name ) }</ListItemText>
            <Grow in={ selected }>
                <ListItemIcon>
                    <Check />
                </ListItemIcon>
            </Grow>
        </ListItem>
    );
}, areEqual );

const createItemData = memoize(( items, onClickItem, selectedItems ) => ({
    items,
    onClickItem,
    selectedItems
}));

/**
 * Ingredients
 */
function Ingredients() {
    const windowSize = useWindowSize();
    const headerHeight = useHeaderHeight();

    const history = useHistory();
    const [ searchTerm, setSearchTerm ] = useState( '' );
    const [ ingredients, setIngredients ] = useState([]);
    const [ selectedIngredients, setSelectedIngredients ] = useState( new Set([]));
    const [ snackbar, setSnackbar ] = useState({
        open: false,
        message: ''
    });

    const { data, loading } = useQuery( GET_INGREDIENTS );

    const debouncedSearchTerm = useDebounce( searchTerm, 200 );

    useEffect(() => {
        data && data.ingredients && setIngredients( data.ingredients );
    }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if ( data && data.ingredients ) {
            let filteredIngredients = data.ingredients;

            if ( debouncedSearchTerm ) {
                const fuse = new Fuse( data.ingredients, options );
                filteredIngredients = fuse.search( debouncedSearchTerm );
            }

            setIngredients( filteredIngredients );
        }
    }, [debouncedSearchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * On change handler for search input
     * @param {SyntethicEvent} event
     */
    function onSearchChange( event ) {
        setSearchTerm( event.target.value );
    }

    /**
     * Fetches ID for list item
     * @param {number} index - Item index
     * @param {object[]} data - Item list
     */
    function getKey( index, { items }) {
        return items[ index ].id;
    }

    /**
     * On click handler for ingredient click
     * @param {string} id - Ingredient ID
     */
    function onClickItem( id ) {
        return function() {
            if ( selectedIngredients.has( id )) {
                selectedIngredients.delete( id );
            } else {
                selectedIngredients.add( id );
            }
            setSelectedIngredients( new Set( selectedIngredients ));
        }
    }

    /**
     * Snack bar close event handler
     * @param {Object} event
     * @param {String} reason
     */
    function handleSnackbarClose( event, reason ) {
        if ( reason === 'clickaway' ) {
            return;
        }

        setSnackbar({
            open: false,
            message: ''
        });
    }

    function searchByIngredient() {
        if ( selectedIngredients.size > 0 ) {
            history.push( '/recipes', {
                ingredients: ingredients.filter(({ id }) => selectedIngredients.has( id ) ),
                selectedIngredients
            })
        } else {
            setSnackbar({
                open: true,
                autoHideDuration: 3000,
                message: 'Select an ingredient'
            });
        }
    }

    const TAB_HEIGHT = 48;
    const SEARCH_INPUT_HEIGHT = 40;
    const SEARCH_BUTTON_HEIGHT = 36;
    const listHeight = windowSize.height - headerHeight - SEARCH_INPUT_HEIGHT - SEARCH_BUTTON_HEIGHT - TAB_HEIGHT - TOTAL_CONTAINER_PADDING;
    const listWidth = windowSize.width - TOTAL_CONTAINER_PADDING;
    const itemSize = 48;

    const itemData = createItemData( ingredients, onClickItem, selectedIngredients );

    return (
        <Wrapper>
            { loading
                ? (
                    <div className="loading">
                        <Loader />
                    </div>
                ) : (
                    <Fade in>
                        <ContentWrapper>
                            <Input
                                value={ searchTerm }
                                className="search-input"
                                fullWidth
                                color="primary"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                }
                                onChange={ onSearchChange }
                            />
                            <List
                                height={ listHeight }
                                width={ listWidth }
                                itemCount={ ingredients.length }
                                itemSize={ itemSize }
                                itemData={ itemData }
                                itemKey={ getKey }
                                innerElementType="ul"
                                className="list"
                            >
                                { Row }
                            </List>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={ searchByIngredient }
                            >
                                Search by Ingredient
                            </Button>
                        </ContentWrapper>
                    </Fade>
                )
            }
            <Snackbar
                key={ snackbar.message }
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                open={ snackbar.open }
                onClose={ handleSnackbarClose }
                ContentProps={{
                    'aria-describedby': 'message-id',
                    style: {
                        backgroundColor: '#ff5252'
                    }
                }}
                message={ <span id="message-id">{ snackbar.message }</span> }
                autoHideDuration={ snackbar.autoHideDuration || null }
            />
        </Wrapper>
    );
}

export default Ingredients;
