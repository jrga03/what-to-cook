import React, { PureComponent, createRef } from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
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

import Multiselect from 'components/Multiselect'; /* eslint-disable-line import/no-unresolved */

import BlockTypeButtons from './BlockTypeButtons';
import InlineStyleButtons from './InlineStyleButtons';
import ActionButtons from './ActionButtons';
import {
    Container,
    TextFieldWrapper,
    EditorWrapper
} from './styles';

const GET_INGREDIENTS = gql`
    {
        ingredients {
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
    state = {
        ingredients: [],
        editorState: EditorState.createEmpty(),
        ingredientsOptions: []
    };

    editorRef = createRef();

    fileInputRef = createRef();

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
        for ( const file of event.target.files ) {
            const convertedImage = await this.convertImageToBase64( file ); // eslint-disable-line
            this.addImageToEditor( convertedImage );
        }
    }

    handlePastedFile = async ([file]) => {
        const convertedImage = await this.convertImageToBase64( file );
        this.addImageToEditor( convertedImage );
    }

    handleDroppedFiles = async ( selectionState, files ) => {
        for ( const file of files ) {
            if ([ 'image/png', 'image/jpeg' ].includes( file.type )) {
                const convertedImage = await this.convertImageToBase64( file ); // eslint-disable-line
                this.addImageToEditor( convertedImage );
            }
        }
    }

    convertImageToBase64 = ( file ) => new Promise(( resolve, reject ) => {
        try {
            const reader = new FileReader();
            reader.onloadend = ( event ) => {
                resolve( event.target.result );
            }
            reader.readAsDataURL( file );
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

    onFetchIngredients = ( data ) => {
        this.setState({ ingredientsOptions: data.ingredients });
    }

    handleChangeIngredients = ( ingredients ) => this.setState({ ingredients });

    handleKeyCommand = ( command, currentEditorState ) => {
        const newState = RichUtils.handleKeyCommand( currentEditorState, command );
        if ( newState ) {
            this.setState({ editorState: newState });
            return 'handled';
        }
        return 'not-handled';
    }

    handleSave = () => {
        console.log( convertToRaw( this.state.editorState.getCurrentContent()));
    }

    render() {
        return (
            <Container>
                <TextFieldWrapper>
                    <TextField
                        id="recipe-name-text-field"
                        label="Recipe Name"
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        id="recipe-description-text-field"
                        label="Description"
                        fullWidth
                        multiline
                        rowsMax={ 4 }
                        margin="normal"
                    />
                    <Query query={ GET_INGREDIENTS } onCompleted={ this.onFetchIngredients }>
                        { ({ loading }) => (
                            <Multiselect
                                id="recipe-ingredients-select"
                                label="Ingredients"
                                placeholder="Select ingredients..."
                                className="multiselect"
                                value={ this.state.ingredients }
                                options={ this.state.ingredientsOptions.map(( options ) => ({ label: options.name, value: options.id })) }
                                onChange={ this.handleChangeIngredients }
                                noOptionsMessage={ ({ inputValue }) => `Cannot find "${inputValue}"` }
                                styles={{
                                    valueContainer: ( style ) => ({ ...style, paddingLeft: 0 })
                                }}
                                isLoading={ loading }
                            />
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
                    />
                    <ActionButtons
                        editorState={ this.state.editorState }
                        onClickUndo={ this.onClickUndo }
                        onClickRedo={ this.onClickRedo }
                        onClickAttach={ this.onClickAttach }
                    />
                    <InlineStyleButtons
                        editorState={ this.state.editorState }
                        onToggle={ this.onToggleInlineStyle }
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
                    />
                    <AlignmentTool />
                </EditorWrapper>
                <div className="button-container">
                    <Button
                        onClick={ this.handleSave }
                        color="primary"
                        variant="contained"
                    >
                        Save
                    </Button>
                </div>
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

export default AddRecipe;
