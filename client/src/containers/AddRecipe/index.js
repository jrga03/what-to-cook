import React, { useState, useMemo, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useHistory } from 'react-router-dom';
import { convertToRaw } from 'draft-js';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Camera from '@material-ui/icons/PhotoCameraOutlined';
import Check from '@material-ui/icons/Check';
import startCase from 'lodash/startCase';
import get from 'lodash/get';

/* eslint-disable import/no-unresolved */
import Multiselect from 'components/Multiselect';
import CreatableMultiselect from 'components/Multiselect/Creatable';
import { upload, compressImage } from 'utils/fileHelper';
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

const SAVE_RECIPE = gql`
    mutation addRecipe(
        $name: String!,
        $description: String,
        $photo: String!,
        $ingredients: [ID],
        $instructions: String!,
        $tags: [ID],
        $newTags: [String]) {
            addRecipe(
                name: $name,
                description: $description,
                photo: $photo,
                ingredients: $ingredients,
                instructions: $instructions,
                tags: $tags,
                newTags: $newTags
            ) {
                id
            }
    }
`;

/**
 *
 * Add Recipe Component
 *
 */
function AddRecipe() {
    const history = useHistory();
    const [ snackbar, setSnackbar ] = useState({
        open: false,
        message: ''
    });
    const [ name, setName ] = useState( '' );
    const [ nameError, setNameError ] = useState( false );
    const [ photoUrlError, setPhotoUrlError ] = useState( false );
    const [ ingredients, setIngredients ] = useState([]);
    const [ tags, setTags ] = useState([]);
    const [ photoUrl, setPhotoUrl ] = useState( null );
    const [ photoName, setPhotoName ] = useState( '' );
    const [ uploading, setUploading ] = useState( false );
    const [ editorUploading, setEditorUploading ] = useState( false );

    const { data, loading } = useQuery( GET_OPTIONS );
    const [ saveRecipe, { loading: saving }] = useMutation( SAVE_RECIPE );

    const options = useMemo(() => ({
        ingredients: ( get( data, 'ingredients', [])).map(( ingredient ) => ({
            label: startCase( ingredient.name ),
            value: ingredient.id
        })),
        tags: ( get( data, 'tags', [])).map(( tag ) => ({
            label: startCase( tag.name ),
            value: tag.id
        }))
    }), [data])

    const recipeNameRef = useRef( null );
    const photoUrlRef = useRef( null );
    const descriptionRef = useRef( null );
    const editorRef = useRef( null );
    const fileInputRef = useRef( null );

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
        const { top, height } = ref.current.getBoundingClientRect();
        const headerHeight = window.innerWidth < 600 ? 56 : 64;

        window.scrollTo({
            top: window.scrollY + top - height - headerHeight,
            behavior: 'smooth'
        });
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
            scrollToRef( recipeNameRef );
            valid = false;
            setNameError( true );
        }

        if ( !photoUrl ) {
            valid && scrollToRef( photoUrlRef );
            valid = false;
            setPhotoUrlError( true );
        }

        return valid;
    }

    /**
     * Save button onClick handler
     */
    async function handleSave() {
        if ( editorUploading ) {
            setSnackbar({
                open: true,
                autoHideDuration: 3000,
                message: 'There are still files being uploaded.'
            });
            return;
        }

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
                photo: photoUrl,
                ingredients: ingredients.map(( ingredient ) => ingredient.value ),
                instructions: JSON.stringify( convertToRaw( editorRef.current.state.editorState.getCurrentContent())),
                tags: _tags.existing,
                newTags: _tags.new
            };

            setSnackbar({
                open: true,
                message: 'Saving recipe...'
            });

            try {
                await saveRecipe({ variables: payload });
                history.push( '/recipes' )
            } catch ( error ) {
                setSnackbar({
                    open: true,
                    autoHideDuration: 3000,
                    message: 'Error saving',
                    type: 'error'
                });
            }
        }
    }

    /**
     * Triggers opening of file select window
     */
    function selectFile() {
        fileInputRef && fileInputRef.current && fileInputRef.current.click();
    }

    /**
     * Handles uploading of image file
     *
     * @param {File} file - File to upload
     * @returns {string} Uploaded image url or empty string
     */
    async function uploadFile( file ) {
        setUploading( true );

        try {
            const uploaded = await upload(
                await compressImage( file ),
                { folder: 'recipe_thumbnails' }
            );

            return uploaded.data.secure_url;
        } catch ( error ) {
            setSnackbar({
                open: true,
                autoHideDuration: 3000,
                message: 'Uploading image failed. Try again.',
                type: 'error'
            });
            return '';
        } finally {
            setUploading( false );
        }
    }

    /**
     * On change handler for file input
     *
     * @param {Object} event - onChange event
     */
    async function onChangeFileInput( event ) {
        const [file] = event.target.files;

        if ( file ) {
            const url = await uploadFile( file );
            setPhotoUrl( url );
            setPhotoUrlError( false );
            setPhotoName( get( file, 'name', '' ));
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
                    disabled={ saving }
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
                    disabled={ saving }
                    inputRef={ descriptionRef }
                />

                <TextField
                    id="recipe-photo-text-field"
                    label="Photo"
                    name="photo"
                    required
                    fullWidth
                    margin="normal"
                    value={ photoName }
                    error={ photoUrlError }
                    helperText={ photoUrlError && 'Required' }
                    onClick={ selectFile }
                    disabled={ saving || uploading }
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                size="small"
                                disabled={ saving || uploading }
                                color={ photoUrl ? 'secondary' : 'primary' }
                            >
                                { photoUrl
                                    ? <Check />
                                    : <Camera color={ photoUrlError ? 'error' : 'inherit' } />
                                }
                                { uploading && (
                                    <CircularProgress
                                        className="circular-progress"
                                        size={ 30 }
                                    />
                                ) }
                            </IconButton>
                        ),
                        readOnly: true
                    }}
                    inputRef={ photoUrlRef }
                />
                <input
                    id="file-input"
                    className="file-input"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={ onChangeFileInput }
                    ref={ fileInputRef }
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
                    isDisabled={ saving }
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
                    isDisabled={ saving }
                />
            </TextFieldWrapper>

            <br />

            <TextFieldWrapper>
                <Typography variant="h6">
                    Instructions
                </Typography>
            </TextFieldWrapper>

            <EditorWithPlugins
                disabled={ saving }
                dispatchSnackbar={ dispatchSnackbar }
                setUploading={ setEditorUploading }
                ref={ editorRef }
            />

            <div className="button-container">
                <Button
                    onClick={ handleSave }
                    color="primary"
                    variant="contained"
                    disabled={ saving }
                >
                    Save
                </Button>
            </div>

            <Snackbar
                key={ snackbar.message }
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                open={ snackbar.open }
                onClose={ handleSnackbarClose }
                ContentProps={{
                    'aria-describedby': 'message-id',
                    style: snackbar.type === 'error' ? {
                        backgroundColor: '#ff5252'
                    } : {}
                }}
                message={ <span id="message-id">{ snackbar.message }</span> }
                autoHideDuration={ snackbar.autoHideDuration || null }
            />
        </Container>
    );
}

export default AddRecipe;
