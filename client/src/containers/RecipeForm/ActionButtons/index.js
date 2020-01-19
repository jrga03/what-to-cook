import React from 'react';
import PropTypes from 'prop-types';
import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';
import AttachFile from '@material-ui/icons/AttachFile';

import ToolbarButton from 'components/ToolbarButton';  // eslint-disable-line import/no-unresolved

const ActionButtons = ({ editorState, onClickUndo, onClickRedo, onClickAttach, disabled }) => {
    const undoStack = editorState.getUndoStack();
    const redoStack = editorState.getRedoStack();

    return (
        <div className="toolbar-controls action-controls">
            <ToolbarButton
                disabled={ disabled || undoStack.size === 0 }
                icon={ <Undo /> }
                onToggle={ onClickUndo }
            />
            <ToolbarButton
                disabled={ disabled || redoStack.size === 0 }
                icon={ <Redo /> }
                onToggle={ onClickRedo }
            />
            <ToolbarButton
                icon={ <AttachFile /> }
                onToggle={ onClickAttach }
                disabled={ disabled }
            />
        </div>
    );
}

ActionButtons.propTypes = {
    editorState: PropTypes.object.isRequired,
    onClickUndo: PropTypes.func.isRequired,
    onClickRedo: PropTypes.func.isRequired,
    onClickAttach: PropTypes.func.isRequired,
    disabled: PropTypes.bool
}

export default ActionButtons;
