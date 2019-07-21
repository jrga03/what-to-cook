import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';

/**
 * Menu component
 */
function Menu( props ) {
    return (
        <Paper
            square
            style={{
                position: 'absolute',
                zIndex: 1,
                marginTop: '10px',
                left: 0,
                right: 0
            }}
            { ...props.innerProps }
        >
            {props.children}
        </Paper>
    );
}

Menu.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object
};

export default Menu;
