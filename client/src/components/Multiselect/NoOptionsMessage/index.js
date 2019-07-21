import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

/**
 * Mo options message component
 */
function NoOptionsMessage( props ) {
    return (
        <Typography
            color="textSecondary"
            style={{
                padding: '8px 16px'
            }}
            { ...props.innerProps }
        >
            {props.children}
        </Typography>
    );
}

NoOptionsMessage.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object
};

export default NoOptionsMessage;
