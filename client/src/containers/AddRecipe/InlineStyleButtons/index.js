import React from 'react';
import PropTypes from 'prop-types';
import Bold from '@material-ui/icons/FormatBold';
import Italic from '@material-ui/icons/FormatItalic';
import Underlined from '@material-ui/icons/FormatUnderlined';

import ToolbarButton from '../ToolbarButton';

const INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD', icon: <Bold /> },
    { label: 'Italic', style: 'ITALIC', icon: <Italic /> },
    { label: 'Underline', style: 'UNDERLINE', icon: <Underlined /> }
];

const InlineStyleButtons = ({ editorState, onToggle, disabled }) => {
    const currentStyle = editorState.getCurrentInlineStyle();

    return (
        <div className="toolbar-controls">
            { INLINE_STYLES.map(( type ) => (
                <ToolbarButton
                    key={ type.style }
                    active={ currentStyle.has( type.style ) }
                    style={ type.style }
                    icon={ type.icon }
                    onToggle={ onToggle }
                    disabled={ disabled }
                />
            )) }
        </div>
    );
};

InlineStyleButtons.propTypes = {
    editorState: PropTypes.object.isRequired,
    onToggle: PropTypes.func.isRequired,
    disabled: PropTypes.bool
}

export default InlineStyleButtons;
