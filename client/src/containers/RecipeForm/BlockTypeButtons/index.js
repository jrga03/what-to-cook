import React from 'react';
import PropTypes from 'prop-types';
import BlockQuote from '@material-ui/icons/FormatQuote';
import Bulleted from '@material-ui/icons/FormatListBulleted';
import Numbered from '@material-ui/icons/FormatListNumbered';

import ToolbarButton from 'components/ToolbarButton'; // eslint-disable-line import/no-unresolved

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

const BlockTypeButtons = ({ editorState, onToggle, disabled }) => {
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey( selection.getStartKey())
        .getType();

    return (
        <div className="toolbar-controls block-type-container">
            { BLOCK_TYPES.map(( row, index ) => (
                <div key={ index }> { /* eslint-disable-line */ }
                    { row.map(( type ) => (
                        <ToolbarButton
                            key={ type.label || type.style }
                            active={ type.style === blockType }
                            label={ type.label }
                            icon={ type.icon }
                            onToggle={ onToggle }
                            style={ type.style }
                            disabled={ disabled }
                        />
                    )) }
                </div>
            )) }
        </div>
    );
}

BlockTypeButtons.propTypes = {
    editorState: PropTypes.object.isRequired,
    onToggle: PropTypes.func.isRequired,
    disabled: PropTypes.bool
}

export default BlockTypeButtons;
