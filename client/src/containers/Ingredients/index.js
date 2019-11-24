import React from 'react';
// import { useHistory } from 'react-router-dom';
import Fade from '@material-ui/core/Fade';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import CircularProgress from '@material-ui/core/CircularProgress';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import startCase from 'lodash/startCase';

import ItemCard from 'components/ItemCard'; // eslint-disable-line import/no-unresolved
import burger from 'images/burgers.jpg'; // eslint-disable-line import/no-unresolved

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
    const { data, loading } = useQuery( GET_INGREDIENTS );

    return (
        <Wrapper>
            { loading
                ? (
                    <div className="loading">
                        <CircularProgress size="15vw" />
                    </div>
                ) : (
                    <Fade in>
                        <GridList cols={ 3 } cellHeight="auto" spacing={ 4 }>
                            { data.ingredients.map(({ id, name }) => (
                                <GridListTile key={ id }>
                                    <ItemCard
                                        label={ startCase( name ) }
                                        image={ burger } // TODO:
                                        imageTitle="Burger" // TODO:
                                        onClick={ () => {} }
                                    />
                                </GridListTile>
                            )) }
                        </GridList>
                    </Fade>
                )
            }
        </Wrapper>
    );
}

export default Ingredients;
