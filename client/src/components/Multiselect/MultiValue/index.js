import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import CancelIcon from '@material-ui/icons/Cancel';

import { toHSL } from '../../../utils/stringToColor';

/**
 * Multi value component
 */
function MultiValue( props ) {
    return (
        <Chip
            tabIndex={ -1 }
            label={ props.children }
            onDelete={ props.removeProps.onClick }
            deleteIcon={ <CancelIcon { ...props.removeProps } /> }
            style={{
                marginRight: '2px',
                marginBottom: '2px',
                backgroundColor: props.data.__isNew__
                    ? undefined
                    : toHSL( props.data.value )
            }}
        />
    );
}

MultiValue.propTypes = {
    children: PropTypes.node,
    isFocused: PropTypes.bool,
    removeProps: PropTypes.object.isRequired
};

export default MultiValue;
