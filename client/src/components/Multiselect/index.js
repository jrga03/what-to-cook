import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import Control from './Control';
import Option from './Option';
import NoOptionsMessage from './NoOptionsMessage';
import Placeholder from './Placeholder';
import Menu from './Menu';
import MultiValue from './MultiValue';

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
