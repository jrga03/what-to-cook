import React, { useState, useMemo } from 'react';
// import { useHistory } from 'react-router-dom';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import startCase from 'lodash/startCase';

import burger from 'images/burgers.jpg'; // eslint-disable-line import/no-unresolved
import ItemCardList from '../../components/ItemCardList';

import Wrapper from './styles';

const GET_INGREDIENTS = gql`
    {
        ingredients {
            id,
            name
        }
    }
`;

/**
 * Ingredients
 */
function Ingredients() {
    // const history = useHistory(); // TODO: use after selecting ingredients
    const [ ingredients, setIngredients ] = useState([]);
    const { data, loading } = useQuery( GET_INGREDIENTS );

    useMemo(() => {
        if ( data ) {
            const newIngredients = data.ingredients.map(({ id, name }) => ({
                id,
                label: startCase( name ),
                selected: false,
                image: burger, // TODO: REMOVE
                imageTitle: 'Burger' // TODO: REMOVE
            }));

            setIngredients( newIngredients );
        }
    }, [data]);

    const onClickItem = ( id, index ) => {
        const ingredientsCopy = Array.from( ingredients );
        ingredientsCopy[ index ].selected = !ingredientsCopy[ index ].selected;

        setIngredients( ingredientsCopy );
    }

    return (
        <Wrapper>
            { loading
                ? (
                    <div className="loading">
                        <CircularProgress size="15vw" />
                    </div>
                ) : (
                    <Fade in>
                        <ItemCardList
                            cols={ 3 }
                            cellHeight="auto"
                            spacing={ 4 }
                            data={ ingredients }
                            onClickItem={ onClickItem }
                        />
                    </Fade>
                )
            }
        </Wrapper>
    );
}

export default Ingredients;
