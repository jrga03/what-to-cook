import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { withRouter } from 'react-router-dom';
import {
    EditorState,
    RichUtils,
    convertToRaw,
    AtomicBlockUtils
} from 'draft-js';
import Editor, { composeDecorators } from 'draft-js-plugins-editor'
import createImagePlugin from 'draft-js-image-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import imageCompression from 'browser-image-compression';
import startCase from 'lodash/startCase';

/* eslint-disable import/no-unresolved */
import Multiselect from 'components/Multiselect';
import CreatableMultiselect from 'components/Multiselect/Creatable';
/* eslint-enable import/no-unresolved */

import BlockTypeButtons from './BlockTypeButtons';
import InlineStyleButtons from './InlineStyleButtons';
import ActionButtons from './ActionButtons';
import {
    Container,
    TextFieldWrapper,
    EditorWrapper
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

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();
const { AlignmentTool } = alignmentPlugin;

const decorator = composeDecorators(
    resizeablePlugin.decorator,
    alignmentPlugin.decorator,
    focusPlugin.decorator,
    blockDndPlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });

const plugins = [
    blockDndPlugin,
    focusPlugin,
    alignmentPlugin,
    resizeablePlugin,
    imagePlugin
];

/**
 *
 * Add Recipe Component
 *
 */
class AddRecipe extends PureComponent {
    static propTypes = {
        history: PropTypes.object
    }

    state = {
        snackbar: {
            open: false,
            message: ''
        },
        name: '',
        description: '',
        editorState: EditorState.createEmpty(),
        ingredients: [],
        ingredients_options: [],
        tags: [],
        tags_options: []
    };

    editorRef = createRef();

    fileInputRef = createRef();

    recipeNameRef = createRef();

    onChangeEditor = ( editorState ) => this.setState({ editorState });

    onEditorWrapperClick = () => {
        if ( !this.state.editorState.getSelection().getHasFocus()) {
            this.setState(({ editorState }) => ({
                editorState: EditorState.moveFocusToEnd( editorState )
            }));
        }
    }

    onToggleBlockType = ( blockType ) => {
        this.setState(({ editorState }) => ({
            editorState: RichUtils.toggleBlockType( editorState, blockType )
        }));
    }

    onToggleInlineStyle = ( inlineStyle ) => {
        this.setState(({ editorState }) => ({
            editorState: RichUtils.toggleInlineStyle( editorState, inlineStyle )
        }));
    }

    onClickUndo = () => {
        this.setState(({ editorState }) => ({
            editorState: EditorState.undo( editorState )
        }));
    }

    onClickRedo = () => {
        this.setState(({ editorState }) => ({
            editorState: EditorState.redo( editorState )
        }));
    }

    onClickAttach = () => {
        if ( this.fileInputRef ) {
            this.fileInputRef.current.click();
        }
    }

    onAttachFile = async ( event ) => {
        this.setState({
            snackbar: {
                open: true,
                message: `Attaching ${event.target.files.length > 1 ? 'files' : 'file'}...`
            }
        });

        for ( const file of event.target.files ) {
            const convertedImage = await this.convertImageToBase64( file ); // eslint-disable-line
            this.addImageToEditor( convertedImage );
        }

        this.setState({
            snackbar: {
                open: false,
                message: ''
            }
        });
    }

    onChangeInput = ( event ) => this.setState({ [ event.target.name ]: event.target.value });

    onBlurInput = ( event ) => this.setState({ [ `${event.target.name}_error` ]: !event.target.value })

    handlePastedFile = async ([file]) => {
        this.setState({
            snackbar: {
                open: true,
                message: 'Attaching file...'
            }
        });

        const convertedImage = await this.convertImageToBase64( file );
        this.addImageToEditor( convertedImage );

        this.setState({
            snackbar: {
                open: false,
                message: ''
            }
        });
    }

    handleDroppedFiles = async ( selectionState, files ) => {
        this.setState({
            snackbar: {
                open: true,
                message: `Attaching ${files.length > 1 ? 'files' : 'file'}...`
            }
        });

        for ( const file of files ) {
            if ([ 'image/png', 'image/jpeg' ].includes( file.type )) {
                const convertedImage = await this.convertImageToBase64( file ); // eslint-disable-line
                this.addImageToEditor( convertedImage );
            }
        }

        this.setState({
            snackbar: {
                open: false,
                message: ''
            }
        });
    }

    async compressImage( image ) {
        const options = {
            maxSizeMB: 0.1
        }
        const compressed = await imageCompression( image, options );
        return compressed;
    }

    convertImageToBase64 = ( file ) => new Promise( async ( resolve, reject ) => {
        try {
            const reader = new FileReader();
            reader.onloadend = ( event ) => {
                resolve( event.target.result );
            }
            reader.readAsDataURL( await this.compressImage( file ));
        } catch ( error ) {
            reject( error );
        }
    })

    addImageToEditor = ( image ) => {
        const contentState = this.state.editorState.getCurrentContent()
        const contentStateWithEntity = contentState.createEntity(
            'image',
            'IMMUTABLE',
            { src: image }
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(
            this.state.editorState,
            { currentContent: contentStateWithEntity },
            "create-entity"
        )

        this.setState({
            editorState: AtomicBlockUtils.insertAtomicBlock(
                newEditorState,
                entityKey,
                ' '
            )
        }, () => this.editorRef.current.focus())
    }

    onFetchOptions = ( data ) => {
        this.setState({
            ingredients_options: data.ingredients.map(( ingredient ) => ({ label: startCase( ingredient.name ), value: ingredient.id })),
            tags_options: data.tags.map(( tag ) => ({ label: startCase( tag.name ), value: tag.id }))
        });
    }

    handleChangeIngredients = ( ingredients ) => this.setState({ ingredients });

    handleChangeTags = ( tags ) => this.setState({ tags });

    handleKeyCommand = ( command, currentEditorState ) => {
        const newState = RichUtils.handleKeyCommand( currentEditorState, command );
        if ( newState ) {
            this.setState({ editorState: newState });
            return 'handled';
        }
        return 'not-handled';
    }

    handleSnackbarClose = ( event, reason ) => {
        if ( reason === 'clickaway' ) {
            return;
        }

        this.setState({
            snackbar: {
                open: false,
                message: ''
            }
        });
    }

    checkForm() {
        let valid = true;
        const newState = {};

        if ( !this.state.name ) {
            valid = false;
            newState.name_error = true;
            this.recipeNameRef.current.focus();
        }

        this.setState( newState );
        return valid;
    }

    handleSave = () => {
        if ( this.checkForm()) {
            const tags = this.state.tags.reduce(( tagsObj, tag ) => {
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
                name: this.state.name,
                description: this.state.description,
                ingredients: this.state.ingredients.map(( ingredient ) => ingredient.value ),
                instructions: JSON.stringify( convertToRaw( this.state.editorState.getCurrentContent())),
                tags: tags.existing,
                newTags: tags.new
            };

            this.setState({
                snackbar: {
                    open: true,
                    message: 'Saving recipe...'
                }
            });
            console.log( payload );

            this.props.history.push( '/recipes' );
        }
    }

    render() {
        return (
            <Container>
                <TextFieldWrapper>
                    <TextField
                        id="recipe-name-text-field"
                        label="Recipe Name"
                        name="name"
                        fullWidth
                        required
                        error={ this.state.name_error }
                        helperText={ this.state.name_error && 'Required' }
                        margin="normal"
                        disabled={ false }
                        value={ this.state.name }
                        onChange={ this.onChangeInput }
                        onBlur={ this.onBlurInput }
                        inputRef={ this.recipeNameRef }
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
                        value={ this.state.description }
                        onChange={ this.onChangeInput }
                    />
                    <Query query={ GET_OPTIONS } onCompleted={ this.onFetchOptions }>
                        { ({ loading }) => (
                            <>
                                <Multiselect
                                    id="recipe-ingredients-select"
                                    label="Ingredients"
                                    placeholder="Select ingredients..."
                                    className="multiselect"
                                    value={ this.state.ingredients }
                                    options={ this.state.ingredients_options }
                                    onChange={ this.handleChangeIngredients }
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
                                    value={ this.state.tags }
                                    options={ this.state.tags_options }
                                    onChange={ this.handleChangeTags }
                                    formatCreateLabel={ ( inputValue ) => `Add tag "${inputValue}"?` }
                                    styles={{
                                        valueContainer: ( style ) => ({ ...style, paddingLeft: 0 })
                                    }}
                                    isLoading={ loading }
                                    isDisabled={ false }
                                />
                            </>
                        ) }
                    </Query>
                </TextFieldWrapper>
                <br />
                <TextFieldWrapper>
                    <Typography variant="h6">
                        Instructions
                    </Typography>
                </TextFieldWrapper>
                <EditorWrapper>
                    <input
                        style={{ display: 'none' }}
                        type="file"
                        id="files"
                        accept="image/png, image/jpeg"
                        name="files[]"
                        multiple
                        onChange={ this.onAttachFile }
                        ref={ this.fileInputRef }
                    />
                    <BlockTypeButtons
                        editorState={ this.state.editorState }
                        onToggle={ this.onToggleBlockType }
                        disabled={ false }
                    />
                    <ActionButtons
                        editorState={ this.state.editorState }
                        onClickUndo={ this.onClickUndo }
                        onClickRedo={ this.onClickRedo }
                        onClickAttach={ this.onClickAttach }
                        disabled={ false }
                    />
                    <InlineStyleButtons
                        editorState={ this.state.editorState }
                        onToggle={ this.onToggleInlineStyle }
                        disabled={ false }
                    />
                    <hr />
                    <Editor
                        editorState={ this.state.editorState }
                        onChange={ this.onChangeEditor }
                        stripPastedStyles
                        tabIndex={ 0 }
                        handleKeyCommand={ this.handleKeyCommand }
                        handlePastedFiles={ this.handlePastedFile }
                        handleDroppedFiles={ this.handleDroppedFiles }
                        blockStyleFn={ getBlockStyle }
                        plugins={ plugins }
                        ref={ this.editorRef }
                        readOnly={ false }
                    />
                    <AlignmentTool />
                </EditorWrapper>
                <div className="button-container">
                    <Button
                        onClick={ this.handleSave }
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
                    open={ this.state.snackbar.open }
                    onClose={ this.handleSnackbarClose }
                    ContentProps={{
                        'aria-describedby': 'message-id'
                    }}
                    message={ <span id="message-id">{ this.state.snackbar.message }</span> }
                />
            </Container>
        );
    }
}

/**
 * Block style getter
 */
function getBlockStyle( block ) {
    switch ( block.getType()) {
            case 'blockquote':
                return 'RichEditor-blockquote';
            default:
                return null;
    }
}

export default withRouter( AddRecipe );
