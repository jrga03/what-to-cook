import React, { useState, useRef, useEffect } from 'react';
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

import CreatableMultiselect from '../../components/Multiselect/Creatable';
import AddIngredients from '../../components/AddIngredients';
import { upload, compressImage } from '../../utils/fileHelper';
import { useHeaderHeight } from '../../utils/hooks';

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
        $ingredients: [RecipeIngredientInput],
        $newIngredients: [NewIngredientInput],
        $instructions: String!,
        $tags: [ID],
        $newTags: [String]) {
            addRecipe(
                name: $name,
                description: $description,
                photo: $photo,
                ingredients: $ingredients,
                newIngredients: $newIngredients,
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
    const headerHeight = useHeaderHeight();

    const [ snackbar, setSnackbar ] = useState({
        open: false,
        message: ''
    });
    const [ name, setName ] = useState( '' );
    const [ nameError, setNameError ] = useState( false );
    const [ photoUrlError, setPhotoUrlError ] = useState( false );
    const [ ingredients, setIngredients ] = useState([]);
    const [ ingredientOptions, setIngredientOptions ] = useState([]);
    const [ tags, setTags ] = useState([]);
    const [ tagOptions, setTagOptions ] = useState([]);
    const [ photoUrl, setPhotoUrl ] = useState( null );
    const [ photoName, setPhotoName ] = useState( '' );
    const [ uploading, setUploading ] = useState( false );
    const [ editorUploading, setEditorUploading ] = useState( false );
    const [ saving, setSaving ] = useState( false );

    const { data, loading } = useQuery( GET_OPTIONS );
    const [saveRecipe] = useMutation( SAVE_RECIPE );

    useEffect(() => {
        if ( !loading && data ) {
            setIngredientOptions( data.ingredients.map(( ingredient ) => ({
                label: startCase( ingredient.name ),
                value: ingredient.id
            })))

            setTagOptions( data.tags.map(( tag ) => ({
                label: startCase( tag.name ),
                value: tag.id
            })))
        }
    }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

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

        window.scrollTo({
            top: window.scrollY + top - height - headerHeight,
            behavior: 'smooth'
        });
    }

    /**
     * Handler for adding ingredient option
     * @param {object} newIngredient
     */
    function handleAddIngredientOption( newIngredient ) {
        const newIngredientOptions = Array.from( ingredientOptions );
        newIngredientOptions.unshift( newIngredient );
        setIngredientOptions( newIngredientOptions )
    }

    /**
     * Handler for adding ingredient
     * @param {object} ingredient
     */
    function handleAddIngredient( ingredient ) {
        setIngredients( ingredients.concat( ingredient ));
    }

    /**
     * Handler for removing ingredient
     * @param {number} index
     */
    function handleRemoveIngredient( index ) {
        const newIngredients = Array.from( ingredients );
        newIngredients.splice( index, 1 );
        setIngredients( newIngredients );
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
            setSaving( true );

            const tagsObject = tags.reduce(( tagsObj, tag ) => {
                const array = tagsObj[ tag.__isNew__ ? 'new' : 'existing' ];
                array.push( tag.value );

                return tagsObj;
            }, {
                new: [],
                existing: []
            });

            const ingredientsObject = ingredients.reduce(( ingredientsObj, { quantity, ingredient, __isNew__ }) => {
                const array = ingredientsObj[ __isNew__ ? 'new' : 'existing' ];
                array.push({
                    quantity,
                    ingredient
                });

                return ingredientsObj;
            }, {
                new: [],
                existing: []
            });

            const payload = {
                name,
                description: descriptionRef.current.value,
                photo: photoUrl,
                ingredients: ingredientsObject.existing,
                newIngredients: ingredientsObject.new,
                instructions: JSON.stringify( convertToRaw( editorRef.current.state.editorState.getCurrentContent())),
                tags: tagsObject.existing,
                newTags: tagsObject.new
            };

            setSnackbar({
                open: true,
                message: 'Saving recipe...'
            });

            try {
                await saveRecipe({ variables: payload });
                history.push( '/recipes' );
            } catch ( error ) {
                setSnackbar({
                    open: true,
                    autoHideDuration: 3000,
                    message: 'Error saving',
                    type: 'error'
                });
                setSaving( false );
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
                { folder: 'recipes' }
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
                    onKeyDown={ ( event ) => {
                        event.preventDefault();
                        [ 'Enter', ' ' ].includes( event.key ) && selectFile()
                    } }
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

                <AddIngredients
                    isLoading={ loading }
                    isDisabled={ saving }
                    ingredients={ ingredientOptions }
                    selectedIngredients={ ingredients }
                    onAddIngredientOption={ handleAddIngredientOption }
                    onAddIngredient={ handleAddIngredient }
                    onRemoveIngredient={ handleRemoveIngredient }
                />

                <CreatableMultiselect
                    id="tags-select"
                    label="Tags"
                    placeholder="Add tags"
                    className="multiselect"
                    value={ tags }
                    options={ tagOptions }
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
                    Directions
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
