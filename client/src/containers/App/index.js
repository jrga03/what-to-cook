/* eslint-disable import/no-unresolved */
import React, { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router';
import styled from 'styled-components';

import NotFoundPage from 'containers/NotFoundPage';
import ComingSoon from 'containers/ComingSoon';
import Header from 'containers/Header';
import Recipes from 'containers/Recipes';

const Dashboard = lazy(() => import( 'containers/Dashboard' ));
const AddRecipe = lazy(() => import( 'containers/AddRecipe' ));

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #eaeaea;

    @media screen and (min-width: 600px) {
        padding-top: 64px;
    }

    padding-top: 56px;
`;

export const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    height: calc( 100vh - 56px );

    @media screen and ( min-width: 600px ) {
        height: calc( 100vh - 64px );
    }
`;

/**
 * App componnent
 */
function App () {
    return (
        <Container>
            <Helmet>
                <title>What To Cook?</title>
                <meta name="description" content="helps decide on what to cook" />
            </Helmet>
            <Header />
            <Suspense fallback={ <Wrapper>Loading...</Wrapper> }>
                <Switch>
                    <Route exact path="/" component={ Dashboard } />
                    <Route exact path="/recipe/add" component={ AddRecipe } />
                    <Route exact path="/recipes" component={ Recipes } />
                    <Route exact path="/recipes/*" component={ ComingSoon } />
                    <Route exact path="/coming-soon" component={ ComingSoon } />
                    <Route component={ NotFoundPage } />
                </Switch>
            </Suspense>
        </Container>
    );
}

export default App;
