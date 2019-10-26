import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ToolbarButtonSpan = styled.span`
    font-weight: 600;
    color: #737373;
    margin-right: 16px;
    margin-bottom: 16px;
    cursor: pointer;

    svg {
        transition: all .2s ease-in-out;
    }

    &:hover:not( .disabled ) {
        color: #4d4d4d;
        font-weight: 900;

        svg {
            transform: scale( 1.1 );
        }
    }

    &.active {
        color: #5890ff;

        &:hover {
            color: #0c5dff;
        }
    }

    &.disabled {
        color: #bfbfbf;
        cursor: default;
    }
`;

const ToolbarButton = ({ style, active, label, icon, action, onToggle, disabled }) => {
    /**
     * Inline style on click handler
     */
    function _onToggle( event ) {
        event.preventDefault();
        !disabled && onToggle( style || action )
    }

    return (
        <ToolbarButtonSpan
            onMouseDown={ _onToggle }
            className={ [ active ? 'active' : '', disabled ? 'disabled' : '' ].join( ' ' ) }
            role="button"
            tabIndex={ 0 }
        >
            { icon || label }
        </ToolbarButtonSpan>
    );
}

ToolbarButton.propTypes = {
    style: PropTypes.string,
    action: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.element,
    active: PropTypes.bool,
    onToggle: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

export default ToolbarButton;
