import React, { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route, Redirect } from 'react-router';
import styled from 'styled-components';

import Loader from '../../components/Loader';

import NotFoundPage from "../NotFoundPage";
import ComingSoon from "../ComingSoon";
import Header from "../Header";

const Dashboard = lazy(() => import( "../Dashboard" ));
const AddRecipe = lazy(() => import( "../AddRecipe" ));
const Recipes = lazy(() => import( "../Recipes" ));

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #eaeaea;
    height: 100vh;
`;

export const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    height: 100%;
`;

const PaddedWrapper = styled.div`
    height: 100vh;
    padding-top: 56px;

    @media screen and (orientation: landscape) {
        padding-top: 48px;
    }

    @media screen and (min-width: 600px) {
        padding-top: 64px;
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
            <PaddedWrapper>
                <Suspense
                    fallback={
                        <Wrapper>
                            <Loader />
                        </Wrapper>
                    }
                >
                    <Switch>
                        <Route exact path="/">
                            <Redirect to="/categories" />
                        </Route>
                        <Route exact path={ [ '/categories', '/ingredients' ] } component={ Dashboard } />
                        <Route exact path="/recipe/add" component={ AddRecipe } />
                        <Route exact path="/recipes" component={ Recipes } />
                        <Route exact path="/categories/*" component={ ComingSoon } />
                        <Route exact path="/coming-soon" component={ ComingSoon } />
                        <Route component={ NotFoundPage } />
                    </Switch>
                </Suspense>
            </PaddedWrapper>
        </Container>
    );
}

export default App;
