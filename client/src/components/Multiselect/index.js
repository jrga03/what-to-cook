import React from 'react';
import Select from 'react-select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import CancelIcon from '@material-ui/icons/Cancel';
import PropTypes from 'prop-types';

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
            style={{ marginRight: '2px' }}
        />
    );
}

MultiValue.propTypes = {
    children: PropTypes.node,
    isFocused: PropTypes.bool,
    removeProps: PropTypes.object.isRequired
};

const components = {
    Control,
    MultiValue,
    Menu,
    Placeholder,
    Option,
    NoOptionsMessage
};

/**
 * Multiselect component
 */
export default function Multiselect({ id, label, placeholder, options, value, onChange, styles, ...rest }) {
    return (
        <Select
            inputId={ id }
            TextFieldProps={{
                label,
                InputLabelProps: {
                    htmlFor: id,
                    shrink: true
                }
            }}
            placeholder={ placeholder }
            options={ options }
            components={ components }
            value={ value }
            onChange={ onChange }
            isMulti
            isClearable={ false }
            styles={ styles }
            { ...rest }
        />
    );
}

Multiselect.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.any.isRequired,
            value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired
        }).isRequired
    ),
    value: PropTypes.any,
    onChange: PropTypes.func,
    styles: PropTypes.object
}

Multiselect.defaultProps = {
    placeholder: 'Select...',
    styles: {}
}
