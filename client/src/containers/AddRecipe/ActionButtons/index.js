import React from 'react';
import PropTypes from 'prop-types';
import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';

import ToolbarButton from '../ToolbarButton';

const ActionButtons = ({ editorState, onClickUndo, onClickRedo }) => {
    const undoStack = editorState.getUndoStack();
    const redoStack = editorState.getRedoStack();

    return (
        <div className="toolbar-controls action-controls">
            <ToolbarButton
                disabled={ undoStack.size === 0 }
                icon={ <Undo /> }
                onToggle={ onClickUndo }
            />
            <ToolbarButton
                disabled={ redoStack.size === 0 }
                icon={ <Redo /> }
                onToggle={ onClickRedo }
            />
        </div>
    );
}

ActionButtons.propTypes = {
    editorState: PropTypes.object.isRequired,
    onClickUndo: PropTypes.func.isRequired,
    onClickRedo: PropTypes.func.isRequired
}

export default ActionButtons;
