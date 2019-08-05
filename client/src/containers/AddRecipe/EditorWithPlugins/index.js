import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import {
    EditorState,
    RichUtils,
    AtomicBlockUtils
} from 'draft-js';
import Editor, { composeDecorators } from 'draft-js-plugins-editor'
import createImagePlugin from 'draft-js-image-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import imageCompression from 'browser-image-compression';

import BlockTypeButtons from '../BlockTypeButtons';
import InlineStyleButtons from '../InlineStyleButtons';
import ActionButtons from '../ActionButtons';
import { EditorWrapper } from '../styles';

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
 * EditorWithPlugins Component
 *
 */
class EditorWithPlugins extends PureComponent {
    static propTypes = {
        disabled: PropTypes.bool.isRequired,
        dispatchSnackbar: PropTypes.func.isRequired
    }

    state = {
        editorState: EditorState.createEmpty()
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
        this.props.dispatchSnackbar({
            open: true,
            message: `Attaching ${event.target.files.length > 1 ? 'files' : 'file'}...`
        });

        for ( const file of event.target.files ) {
            const convertedImage = await this.convertImageToBase64( file ); // eslint-disable-line
            this.addImageToEditor( convertedImage );
        }

        this.props.dispatchSnackbar({
            open: false,
            message: ''
        });
    }

    onChangeInput = ( event ) => this.setState({ [ event.target.name ]: event.target.value });

    onBlurInput = ( event ) => this.setState({ [ `${event.target.name}_error` ]: !event.target.value })

    handlePastedFile = async ([file]) => {
        this.props.dispatchSnackbar({
            open: true,
            message: 'Attaching file...'
        });

        const convertedImage = await this.convertImageToBase64( file );
        this.addImageToEditor( convertedImage );

        this.props.dispatchSnackbar({
            open: false,
            message: ''
        });
    }

    handleDroppedFiles = async ( selectionState, files ) => {
        this.props.dispatchSnackbar({
            open: true,
            message: `Attaching ${files.length > 1 ? 'files' : 'file'}...`
        });

        for ( const file of files ) {
            if ([ 'image/png', 'image/jpeg' ].includes( file.type )) {
                const convertedImage = await this.convertImageToBase64( file ); // eslint-disable-line
                this.addImageToEditor( convertedImage );
            }
        }

        this.props.dispatchSnackbar({
            open: false,
            message: ''
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

    handleKeyCommand = ( command, currentEditorState ) => {
        const newState = RichUtils.handleKeyCommand( currentEditorState, command );
        if ( newState ) {
            this.setState({ editorState: newState });
            return 'handled';
        }
        return 'not-handled';
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

    render() {
        return (
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
                    disabled={ this.props.disabled }
                />
                <ActionButtons
                    editorState={ this.state.editorState }
                    onClickUndo={ this.onClickUndo }
                    onClickRedo={ this.onClickRedo }
                    onClickAttach={ this.onClickAttach }
                    disabled={ this.props.disabled }
                />
                <InlineStyleButtons
                    editorState={ this.state.editorState }
                    onToggle={ this.onToggleInlineStyle }
                    disabled={ this.props.disabled }
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
                    readOnly={ this.props.disabled }
                />
                <AlignmentTool />
            </EditorWrapper>
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

export default EditorWithPlugins;
