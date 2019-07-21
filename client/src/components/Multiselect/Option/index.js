import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';

/**
 * Option component
 */
function Option( props ) {
    return (
        <MenuItem
            ref={ props.innerRef }
            selected={ props.isFocused }
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400
            }}
            { ...props.innerProps }
        >
            {props.children}
        </MenuItem>
    );
}

Option.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    innerRef: PropTypes.oneOfType([ PropTypes.func, PropTypes.object ]),
    isFocused: PropTypes.bool,
    isSelected: PropTypes.bool
};

export default Option;
