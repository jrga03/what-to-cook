import React, { useState, useEffect } from 'react';
// import { useHistory } from 'react-router-dom';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import startCase from 'lodash/startCase';

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

    useEffect(() => {
        if ( !loading && data ) {
            const newIngredients = data.ingredients.map(({ id, name }) => ({
                id,
                label: startCase( name ),
                selected: false,
                image: 'https://res.cloudinary.com/what-to-cook/image/upload/t_media_lib_thumb/v1576648639/sample.jpg', // TODO: REMOVE
                imageTitle: 'FALLBACK' // TODO: REMOVE
            }));

            setIngredients( newIngredients );
        }
    }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

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
