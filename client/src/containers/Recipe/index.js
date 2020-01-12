import React from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useParams, useHistory } from 'react-router-dom';

import Loader from '../../components/Loader';

const GET_RECIPE = gql`
    query recipe( $id: ID! ) {
        recipe( id: $id ) {
            id
            name
            description
            photo
            instructions
            ingredients {
                quantity
                ingredient {
                    id
                    name
                }
            }
            tags {
                id
                name
            }
        }
    }
`;

/**
 * Recipe component
 */
function Recipe() {
    const { id } = useParams();

    const { data: { recipe } = {}, loading } = useQuery( GET_RECIPE, {
        variables: { id }
    });

    return (
        <div>
            { loading ? (
                <Loader />
            ) : (
                <div>
                    { recipe.name }
                    { recipe.description }
                </div>
            ) }
        </div>
    );
}

export default Recipe;