import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import startCase from 'lodash/startCase';

/**
 * Ingredients component
 */
function Ingredients({ ingredients }) {
    const [ selected, setSelected ] = useState( new Map());

    function handleChange( id ) {
        return function( event ) {
            setSelected( new Map( selected.set( id, event.target.checked )));
        }
    };

    return (
        <FormControl component="fieldset">
            <FormGroup>
                {
                    ingredients.map(({ quantity, ingredient }) => (
                        <FormControlLabel
                            key={ ingredient.id }
                            control={
                                <Checkbox
                                    checked={ Boolean( selected.get( ingredient.id )) }
                                    onChange={ handleChange( ingredient.id ) }
                                    value={ ingredient.id }
                                />
                            }
                            label={ `${quantity} ${startCase( ingredient.name )}` }
                        />
                    ))
                }
            </FormGroup>
        </FormControl>
    );
}

Ingredients.propTypes = {
    ingredients: PropTypes.arrayOf(
        PropTypes.shape({
            quantity: PropTypes.string,
            ingredient: PropTypes.shape({
                id: PropTypes.string,
                name: PropTypes.string
            })
        })
    ).isRequired
}

export default Ingredients;