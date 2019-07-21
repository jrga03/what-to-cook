import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

/**
 * Input component for Control
 */
function inputComponent({ inputRef, ...props }) {
    return <div ref={ inputRef } { ...props } />;
}

inputComponent.propTypes = {
    inputRef: PropTypes.oneOfType([ PropTypes.func, PropTypes.object ])
};

/**
 * Control component
 */
function Control( props ) {
    const {
        children,
        innerProps,
        innerRef,
        selectProps: { TextFieldProps }
    } = props;

    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    style: {
                        display: 'flex',
                        padding: '2px 0',
                        height: 'auto'
                    },
                    ref: innerRef,
                    children,
                    ...innerProps
                }
            }}
            { ...TextFieldProps }
        />
    );
}

Control.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    innerRef: PropTypes.oneOfType([ PropTypes.func, PropTypes.object ]),
    selectProps: PropTypes.object.isRequired
};

export default Control;
