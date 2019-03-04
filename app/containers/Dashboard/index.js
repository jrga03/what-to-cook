import React, { PureComponent } from 'react';

import Wrapper from './styles';

import RecipeList from '../../components/RecipeList';

/* eslint-disable-next-line react/prefer-stateless-function */
export default class Dashboard extends PureComponent {
    render() {
        return (
            <Wrapper>
                <RecipeList />
            </Wrapper>
        );
    }
}