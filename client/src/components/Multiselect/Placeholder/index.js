import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

/**
 * Placeholder component
 */
function Placeholder( props ) {
    return (
        <Typography
            color="textSecondary"
            style={{
                position: 'absolute',
                left: 2,
                bottom: 6,
                fontSize: 16
            }}
            { ...props.innerProps }
        >
            {props.children}
        </Typography>
    );
}

Placeholder.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object
};

export default Placeholder;
