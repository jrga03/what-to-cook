import React from 'react';
import { withRouter } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const GET_RECIPES = gql`
    {
        recipes {
            id
            name
            description
            photo
        }
    }
`;

/**
 * Recipes component
 */
function Recipes() {
    const { data, loading } = useQuery( GET_RECIPES, { pollInterval: 60000 });

    if ( loading ) {
        return (
            <h1>
                Loading...
            </h1>
        );
    }

    return (
        <div>
            {
                data.recipes.map(( recipe ) => (
                    <p key={ recipe.id }>{ recipe.name }</p>
                ))
            }
        </div>
    );
}

export default withRouter( Recipes );