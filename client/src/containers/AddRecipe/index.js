import React, { useState, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo-hooks';
import { gql } from 'apollo-boost';
import { withRouter } from 'react-router-dom';
import { convertToRaw } from 'draft-js';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import startCase from 'lodash/startCase';

/* eslint-disable import/no-unresolved */
import Multiselect from 'components/Multiselect';
import CreatableMultiselect from 'components/Multiselect/Creatable';
/* eslint-enable import/no-unresolved */

import EditorWithPlugins from './EditorWithPlugins';
import {
    Container,
    TextFieldWrapper
} from './styles';

const GET_OPTIONS = gql`
    {
        ingredients {
            id,
            name
        },
        tags {
            id,
            name
        }
    }
`;

/**
 *
 * Add Recipe propTypes
 *
 */
AddRecipe.propTypes = {
    history: PropTypes.object
}

/**
 *
 * Add Recipe Component
 *
 */
function AddRecipe({ history }) {
    const [ snackbar, setSnackbar ] = useState({
        open: false,
        message: ''
    });
    const [ name, setName ] = useState( '' );
    const [ nameError, setNameError ] = useState( false );
    const [ ingredients, setIngredients ] = useState([]);
    const [ tags, setTags ] = useState([]);

    const { data, loading } = useQuery( GET_OPTIONS );

    const options = useMemo(() => ({
        ingredients: ( data.ingredients || []).map(( ingredient ) => ({ label: startCase( ingredient.name ), value: ingredient.id })),
        tags: ( data.tags || []).map(( tag ) => ({ label: startCase( tag.name ), value: tag.id }))
    }), [data])

    const recipeNameRef = useRef( null );
    const descriptionRef = useRef( null );
    const editorRef = useRef( null );

    /**
     * Recipe name input onChange handler
     * @param {Object} event - change event
     */
    function onChangeName( event ) {
        setName( event.target.value );
    }

    /**
     * Recipe name input onBlur handler
     * @param {Object} event - blur event
     */
    function onBlurName( event ) {
        setNameError( !event.target.value );
    }

    /**
     * Scrolls to component
     * @param {Object} ref - Component ref
     */
    function scrollToRef( ref ) {
        window.scrollTo( 0, ref.current.offsetTop );
    }

    /**
     * Ingredients onChange handler
     * @param {Array} _ingredients - Selected ingredients
     */
    function handleChangeIngredients( _ingredients ) {
        setIngredients( _ingredients );
    }

    /**
     * Tags onChange handler
     * @param {Array} _tags - Selected tags
     */
    function handleChangeTags( _tags ) {
        setTags( _tags );
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

    /**
     * Dispatcher for snackbar
     * @param {String} config.message - message
     * @param {Boolean} config.open - snackbar open state
     */
    function dispatchSnackbar( config ) {
        setSnackbar( config );
    }

    /**
     * Checks form validity
     * @returns {Boolean}
     */
    function checkForm() {
        let valid = true;

        if ( !name ) {
            valid = false;
            setNameError( true );
            scrollToRef( recipeNameRef );
            recipeNameRef.current.focus();
        }

        return valid;
    }

    /**
     * Save button onClick handler
     */
    function handleSave() {
        if ( checkForm()) {
            const _tags = tags.reduce(( tagsObj, tag ) => {
                if ( tag.__isNew__ ) {
                    tagsObj.new.push( tag.value );
                } else {
                    tagsObj.existing.push( tag.value )
                }
                return tagsObj;
            }, {
                new: [],
                existing: []
            });

            const payload = {
                name,
                description: descriptionRef.current.value,
                ingredients: ingredients.map(( ingredient ) => ingredient.value ),
                instructions: JSON.stringify( convertToRaw( editorRef.current.state.editorState.getCurrentContent())),
                tags: _tags.existing,
                newTags: _tags.new
            };

            setSnackbar({
                open: true,
                message: 'Saving recipe...'
            });
            console.log( payload );

            history.push( '/recipes' );
        }
    }

    return (
        <Container>
            <TextFieldWrapper>
                <TextField
                    id="recipe-name-text-field"
                    label="Recipe Name"
                    name="name"
                    fullWidth
                    required
                    error={ nameError }
                    helperText={ nameError && 'Required' }
                    margin="normal"
                    disabled={ false }
                    value={ name }
                    onChange={ onChangeName }
                    onBlur={ onBlurName }
                    inputRef={ recipeNameRef }
                />
                <TextField
                    id="recipe-description-text-field"
                    label="Description"
                    name="description"
                    fullWidth
                    multiline
                    rowsMax={ 4 }
                    margin="normal"
                    disabled={ false }
                    inputRef={ descriptionRef }
                />
                <Multiselect
                    id="recipe-ingredients-select"
                    label="Ingredients"
                    placeholder="Select ingredients..."
                    className="multiselect"
                    value={ ingredients }
                    options={ options.ingredients }
                    onChange={ handleChangeIngredients }
                    noOptionsMessage={ ({ inputValue }) => `Cannot find "${inputValue}"` }
                    styles={{
                        valueContainer: ( style ) => ({ ...style, paddingLeft: 0 })
                    }}
                    isLoading={ loading }
                    isDisabled={ false }
                />
                <CreatableMultiselect
                    id="tags-select"
                    label="Tags"
                    placeholder="Add tags"
                    className="multiselect"
                    value={ tags }
                    options={ options.tags }
                    onChange={ handleChangeTags }
                    formatCreateLabel={ ( inputValue ) => `Add tag "${inputValue}"?` }
                    styles={{
                        valueContainer: ( style ) => ({ ...style, paddingLeft: 0 })
                    }}
                    isLoading={ loading }
                    isDisabled={ false }
                />
            </TextFieldWrapper>
            <br />
            <TextFieldWrapper>
                <Typography variant="h6">
                    Instructions
                </Typography>
            </TextFieldWrapper>
            <EditorWithPlugins dispatchSnackbar={ dispatchSnackbar } ref={ editorRef } />
            <div className="button-container">
                <Button
                    onClick={ handleSave }
                    color="primary"
                    variant="contained"
                    disabled={ false }
                >
                    Save
                </Button>
            </div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                open={ snackbar.open }
                onClose={ handleSnackbarClose }
                ContentProps={{
                    'aria-describedby': 'message-id'
                }}
                message={ <span id="message-id">{ snackbar.message }</span> }
            />
        </Container>
    );
}

export default withRouter( AddRecipe );
