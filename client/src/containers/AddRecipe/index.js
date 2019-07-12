import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Editor, EditorState, RichUtils } from 'draft-js';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Bold from '@material-ui/icons/FormatBold'
import Italic from '@material-ui/icons/FormatItalic'
import Underlined from '@material-ui/icons/FormatUnderlined'
import BlockQuote from '@material-ui/icons/FormatQuote'
import Bulleted from '@material-ui/icons/FormatListBulleted'
import Numbered from '@material-ui/icons/FormatListNumbered'

import Multiselect from 'components/Multiselect'; /* eslint-disable-line import/no-unresolved */

const Container = styled.main`
    width: 100vw;
    max-width: 960px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 50px;
    
    .button-container {
        display: flex;
        width: 100%;
        justify-content: flex-end;

        button {
            margin-top: 10px;
            margin-right: 25px;
        }
    }
`;

const TextFieldWrapper = styled.div`
    width: calc( 100% - 2rem);
    box-sizing: border-box;

    h6 {
        color: rgba( 0, 0, 0, 0.54 );
        font-size: 16px;
    }

    .multiselect {
        margin-top: 16px;
        margin-bottom: 8px;
    }
`;

const EditorWrapper = styled.div`
    width: calc( 100% - 2rem);
    box-sizing: border-box;
    border: 1px solid #999;
    border-radius: 10px;
    padding: 1rem 0.5rem;

    & > div {
        width: 100%;
    }

    .DraftEditor-root {
        min-height: 50vh;
    }

    .RichEditor-blockquote {
        border-left: 5px solid #eee;
        color: #666;
        font-weight: bold;
        margin: 16px 0;
        padding: 10px 20px;
    }

    .style-controls {
        margin-left: 10px;
    }

    .block-type-container {
        display: flex;
        flex-wrap: wrap;

        & > div {
            margin-top: 10px;
            margin-bottom: 10px;
        }
    }
`;

const StyleButtonSpan = styled.span`
    color: #999;
    margin-right: 16px;
    margin-bottom: 16px;
    cursor: pointer;

    &.active {
        color: #5890ff;
    }
`;

const StyleButton = ({ style, active, label, icon, onToggle }) => {
    /**
     * Inline style on click handler
     */
    function _onToggle( event ) {
        event.preventDefault();
        onToggle( style )
    }

    return (
        <StyleButtonSpan
            onMouseDown={ _onToggle }
            className={ active ? 'active' : '' }
            role="button"
            tabIndex={ 0 }
        >
            { icon || label }
        </StyleButtonSpan>
    );
}

StyleButton.propTypes = {
    style: PropTypes.string.isRequired,
    label: PropTypes.string,
    icon: PropTypes.element,
    active: PropTypes.bool,
    onToggle: PropTypes.func.isRequired
};

const BLOCK_TYPES = [
    [
        { label: 'H1', style: 'header-one' },
        { label: 'H2', style: 'header-two' },
        { label: 'H3', style: 'header-three' },
        { label: 'H4', style: 'header-four' },
        { label: 'H5', style: 'header-five' },
        { label: 'H6', style: 'header-six' }
    ],
    [
        { label: 'Blockquote', style: 'blockquote', icon: <BlockQuote /> },
        { label: 'UL', style: 'unordered-list-item', icon: <Bulleted /> },
        { label: 'OL', style: 'ordered-list-item', icon: <Numbered /> }
    ]
]

const BlockTypeButtons = ({ editorState, onToggle }) => {
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey( selection.getStartKey())
        .getType();

    return (
        <div className="style-controls block-type-container">
            { BLOCK_TYPES.map(( row, index ) => (
                <div key={ index }> { /* eslint-disable-line */ }
                    { row.map(( type ) => (
                        <StyleButton
                            key={ type.label || type.style }
                            active={ type.style === blockType }
                            label={ type.label }
                            icon={ type.icon }
                            onToggle={ onToggle }
                            style={ type.style }
                        />
                    )) }
                </div>
            )) }
        </div>
    );
}

BlockTypeButtons.propTypes = {
    editorState: PropTypes.object.isRequired,
    onToggle: PropTypes.func.isRequired
}

const INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD', icon: <Bold /> },
    { label: 'Italic', style: 'ITALIC', icon: <Italic /> },
    { label: 'Underline', style: 'UNDERLINE', icon: <Underlined /> }
];

const InlineStyleButtons = ({ editorState, onToggle }) => {
    const currentStyle = editorState.getCurrentInlineStyle();

    return (
        <div className="style-controls">
            { INLINE_STYLES.map(( type ) => (
                <StyleButton
                    key={ type.style }
                    active={ currentStyle.has( type.style ) }
                    style={ type.style }
                    icon={ type.icon }
                    onToggle={ onToggle }
                />
            )) }
        </div>
    );
};

InlineStyleButtons.propTypes = {
    editorState: PropTypes.object.isRequired,
    onToggle: PropTypes.func.isRequired
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

/**
 *
 * Add Recipe Component
 *
 */
function AddRecipe() {
    const [ ingredients, setIngredients ] = useState([]);
    const [ editorState, setEditorState ] = useState( EditorState.createEmpty());
    const editorRef = useRef( null );
    // useEffect(() => console.log( editorState.getUndoStack())); // TODO: ???
    // useEffect(() => console.log( ingredients ))

    /**
     * Set ingredients handler
     */
    function handleSetIngredients( value ) {
        setIngredients( value );
    }

    /**
     * Wrapper click handler
     */
    function onWrapperClick() {
        if ( !editorState.getSelection().getHasFocus()) {
            setEditorState( EditorState.moveFocusToEnd( editorState ));
        }
    }

    /**
     * Handler for key commands
     */
    function handleKeyCommand( command, currentEditorState ) {
        const newState = RichUtils.handleKeyCommand( currentEditorState, command );
        if ( newState ) {
            setEditorState( newState );
            return 'handled';
        }
        return 'not-handled';
    }

    /**
     * Handler for toggling block type
     */
    function onToggleBlockType( blockType ) {
        setEditorState( RichUtils.toggleBlockType( editorState, blockType ));
    }

    /**
     * Handler for toggling inline style
     */
    function onToggleInlineStyle( inlineStyle ) {
        setEditorState( RichUtils.toggleInlineStyle( editorState, inlineStyle ));
    }

    /**
     * On save handler
     */
    function handleSave() {
        console.log( 'SAVE' );
    }

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
                <Multiselect
                    id="recipe-ingredients-select"
                    options={ [
                        { label: 'Pepper (mock)', value: 'pepper' },
                        { label: 'Salt (mock)', value: 'salt' }
                    ] }
                    value={ ingredients }
                    onChange={ handleSetIngredients }
                    className="multiselect"
                    formatCreateLabel={ ( value ) => `Add "${value}" to the ingredients` }
                />
            </TextFieldWrapper>
            <br />
            <TextFieldWrapper>
                <Typography variant="h6">
                    Instructions
                </Typography>
            </TextFieldWrapper>
            <EditorWrapper onClick={ onWrapperClick }>
                <BlockTypeButtons editorState={ editorState } onToggle={ onToggleBlockType } />
                <InlineStyleButtons editorState={ editorState } onToggle={ onToggleInlineStyle } />
                <hr />
                <Editor
                    editorState={ editorState }
                    onChange={ setEditorState }
                    stripPastedStyles
                    tabIndex={ 0 }
                    handleKeyCommand={ handleKeyCommand }
                    handlePastedFiles={ ( files ) => console.log( files ) }
                    handleDroppedFiles={ ( files ) => console.log( files ) }
                    blockStyleFn={ getBlockStyle }
                    ref={ editorRef }
                />
            </EditorWrapper>
            <div className="button-container">
                <Button
                    onClick={ handleSave }
                    color="primary"
                    variant="contained"
                >
                    Save
                </Button>
            </div>
        </Container>
    );
}

export default AddRecipe;
