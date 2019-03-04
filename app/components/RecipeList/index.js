import React from 'react';
import PropTypes from 'prop-types';

import { Wrapper, ScrollWrapper } from './styles';
import MOCK_RECIPES from './mockList';

import RecipeCard from '../RecipeCard';

const RecipeList = ( props ) => {
    const { recipes } = props;

    return (
        <Wrapper>
            <ScrollWrapper>
                {
                    recipes.map(( recipe ) => (
                        <RecipeCard key={ recipe.key } name={ recipe.name } />
                    ))
                }
            </ScrollWrapper>
        </Wrapper>
    );
}

RecipeList.propTypes = {
    recipes: PropTypes.array
};

RecipeList.defaultProps = {
    recipes: MOCK_RECIPES
}

export default RecipeList;