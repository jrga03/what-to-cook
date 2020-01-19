import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import CreatableSelect from 'react-select/creatable'
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';

import Control from '../Multiselect/Control';
import Option from '../Multiselect/Option';
import NoOptionsMessage from '../Multiselect/NoOptionsMessage';
import Placeholder from '../Multiselect/Placeholder';
import Menu from '../Multiselect/Menu';

import { Wrapper, LineWrapper } from './styles';

const components = {
    Control,
    Menu,
    Placeholder,
    Option,
    NoOptionsMessage
};

/**
 * AddedIngredients component
 */
function AddedIngredients({ isDisabled, selectedIngredients, onRemoveIngredient }) {
    const handleRemoveIngredient = ( index ) => () => {
        onRemoveIngredient( index );
    };

    return (
        <>
            { selectedIngredients.map(( selectedIngredient, index ) => (
                <LineWrapper key={ selectedIngredient.ingredient }>
                    <Input
                        className="input"
                        value={ selectedIngredient.quantity }
                        disabled
                    />
                    <Input
                        className="input"
                        value={ selectedIngredient.name }
                        disabled
                    />
                    <IconButton
                        onClick={ handleRemoveIngredient( index ) }
                        disabled={ isDisabled }
                    >
                        <Remove color="error" />
                    </IconButton>
                </LineWrapper>
            )) }
        </>
    );
}

AddedIngredients.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    selectedIngredients: PropTypes.arrayOf(
        PropTypes.shape({
            quantity: PropTypes.string,
            ingredient: PropTypes.string,
            name: PropTypes.string
        })
    ).isRequired,
    onRemoveIngredient: PropTypes.func.isRequired
}

/**
 * IngredientInput component
 */
function IngredientInput({ isLoading, isDisabled, ingredients, onAddIngredientOption, onAddIngredient }) {
    const inputRef = useRef();

    const [ selectedIngredient, setSelectedIngredient ] = useState( null );
    const [ error, setError ] = useState( false );

    useEffect(() => {
        if ( !isLoading ) {
            setSelectedIngredient( ingredients[ 0 ])
        }
    }, [ ingredients, isLoading ])

    const handleAddIngredient = () => {
        const quantity = inputRef.current.value;

        if ( quantity ) {
            const {
                label,
                __isNew__ = false
            } = ingredients.find(( ingredient ) => ingredient.value === selectedIngredient.value );

            onAddIngredient({
                quantity,
                ingredient: selectedIngredient.value,
                name: label,
                __isNew__
            });

            inputRef.current.value = '';
            if ( ingredients.length > 1 ) {
                const { value } = ingredients.find(( ingredient ) => ingredient.value !== selectedIngredient.value );
                setSelectedIngredient( value )
            }
        } else {
            setError( true );
        }
    }

    const onSelectIngredient = ( ingredient, { action }) => {
        if ( action === 'create-option' ) {
            const formattedValue = Object.assign({}, ingredient, {
                label: startCase( toLower( ingredient.label )),
                value: toLower( ingredient.value )
            });
            onAddIngredientOption( formattedValue );
            setSelectedIngredient( formattedValue );
        } else {
            setSelectedIngredient( ingredient );
        }
    }

    return (
        <LineWrapper>
            <Input
                className="input"
                placeholder="Quantity"
                error={ error }
                onFocus={ () => setError( false ) }
                disabled={ isDisabled }
                inputRef={ inputRef }
            />

            <CreatableSelect
                className="select"
                components={ components }
                isClearable={ false }
                options={ ingredients }
                onChange={ onSelectIngredient }
                value={ selectedIngredient }
                formatCreateLabel={ ( inputValue ) => `Add ingredient "${inputValue}"?` }
                isLoading={ isLoading }
                disabled={ isDisabled }
            />

            <IconButton
                onClick={ handleAddIngredient }
                disabled={ isDisabled }
            >
                <Add />
            </IconButton>
        </LineWrapper>
    );
}

IngredientInput.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    ingredients: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string,
            label: PropTypes.string
        })
    ).isRequired,
    onAddIngredientOption: PropTypes.func.isRequired,
    onAddIngredient: PropTypes.func.isRequired
}

/**
 * AddIngredients component
 */
function AddIngredients({
    isLoading,
    isDisabled,
    ingredients,
    selectedIngredients,
    onAddIngredientOption,
    onAddIngredient,
    onRemoveIngredient
}) {
    const filteredIngredients = ingredients.filter(( ingredient ) =>
        !selectedIngredients.some(( selected ) => selected.ingredient === ingredient.value )
    );

    return (
        <Wrapper>
            <span className="title">Ingredients</span>
            <div>
                { selectedIngredients.length > 0 && (
                    <AddedIngredients
                        selectedIngredients={ selectedIngredients }
                        onRemoveIngredient={ onRemoveIngredient }
                        isDisabled={ isDisabled }
                    />
                ) }
                <IngredientInput
                    ingredients={ filteredIngredients }
                    onAddIngredient={ onAddIngredient }
                    onAddIngredientOption={ onAddIngredientOption }
                    isLoading={ isLoading }
                    isDisabled={ isDisabled }
                />
            </div>
        </Wrapper>
    );
}

AddIngredients.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    ingredients: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string,
            label: PropTypes.string
        })
    ).isRequired,
    selectedIngredients: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string,
            label: PropTypes.string
        })
    ).isRequired,
    onAddIngredientOption: PropTypes.func.isRequired,
    onAddIngredient: PropTypes.func.isRequired,
    onRemoveIngredient: PropTypes.func.isRequired
}

export default AddIngredients;