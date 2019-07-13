import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from 'react-apollo-hooks';
import { gql } from 'apollo-boost';
import { Editor, EditorState, RichUtils } from 'draft-js';
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

/**
 *
 * Add Recipe Component
 *
 */
function AddRecipe() {
    const [ ingredientsOptions, setIngredientsOptions ] = useState([]);
    const [ ingredients, setIngredients ] = useState([]);
    const [ editorState, setEditorState ] = useState( EditorState.createEmpty());
    const { data, error, loading: ingredientOptionsLoading } = useQuery( GET_INGREDIENTS );
    const editorRef = useRef( null );

    useEffect(() => {
        const onGetIngredientsSuccess = ( ingredientsData ) => {
            setIngredientsOptions( ingredientsData )
        };

        if ( onGetIngredientsSuccess && !ingredientOptionsLoading && !error ) {
            onGetIngredientsSuccess( data.ingredients )
        }
    }, [ data, error, ingredientOptionsLoading ])

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
     * Handler for undo action
     */
    function onClickUndo() {
        setEditorState( EditorState.undo( editorState ));
    }

    /**
     * Handler for redo action
     */
    function onClickRedo() {
        setEditorState( EditorState.redo( editorState ));
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
                    label="Ingredients"
                    placeholder="Select ingredients..."
                    className="multiselect"
                    value={ ingredients }
                    options={ ingredientsOptions.map(( options ) => ({ label: options.name, value: options.id })) }
                    onChange={ handleSetIngredients }
                    noOptionsMessage={ ({ inputValue }) => `Cannot find "${inputValue}"` }
                    styles={{
                        valueContainer: ( style ) => ({ ...style, paddingLeft: 0 })
                    }}
                    isLoading={ ingredientOptionsLoading }
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
                <ActionButtons editorState={ editorState } onClickUndo={ onClickUndo } onClickRedo={ onClickRedo } />
                <InlineStyleButtons editorState={ editorState } onToggle={ onToggleInlineStyle } />
                <hr />
                <Editor
                    editorState={ editorState }
                    onChange={ setEditorState }
                    stripPastedStyles
                    tabIndex={ 0 }
                    handleKeyCommand={ handleKeyCommand }
                    handlePastedFiles={ ( files ) => console.log( files ) }
                    handleDroppedFiles={ ( ...files ) => console.log( files ) }
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
