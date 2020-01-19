import React, { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import styled, { css } from 'styled-components';

import Loader from '../../components/Loader';

import NotFoundPage from "../NotFoundPage";
import ComingSoon from "../ComingSoon";
import Header from "../Header";

const Dashboard = lazy(() => import( "../Dashboard" ));
const RecipeForm = lazy(() => import( "../RecipeForm" ));
const Recipes = lazy(() => import( "../Recipes" ));
const RecipeDetails = lazy(() => import( "../RecipeDetails" ));

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #eaeaea;
    height: 100vh;
`;

export const LoaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
`;

const padTopCss = css`
    padding-top: 56px;

    @media screen and (orientation: landscape) {
        padding-top: 48px;
    }

    @media screen and (min-width: 600px) {
        padding-top: 64px;
    }
`;

const ContentWrapper = styled.div`
    height: 100vh;
    ${({ topPadded }) => topPadded && padTopCss }
`;

/**
 * App componnent
 */
function App () {
    const recipeRouteMatch = useRouteMatch( '/recipe/:id' );
    const isRecipeRoute = recipeRouteMatch
        && recipeRouteMatch.url !== '/recipe/add'
        && recipeRouteMatch.isExact;

    return (
        <Container>
            <Helmet>
                <title>What To Cook?</title>
                <meta name="description" content="helps decide on what to cook" />
            </Helmet>

            { !isRecipeRoute && (
                <Header />
            ) }

            <ContentWrapper topPadded={ !isRecipeRoute }>
                <Suspense
                    fallback={
                        <LoaderWrapper>
                            <Loader />
                        </LoaderWrapper>
                    }
                >
                    <Switch>
                        <Route exact path="/">
                            <Redirect to="/categories" />
                        </Route>
                        <Route exact path={ [ '/categories', '/ingredients' ] } component={ Dashboard } />
                        <Route exact path={ [ '/recipe/add', '/recipe/:id/edit' ] } component={ RecipeForm } />
                        <Route exact path="/recipes" component={ Recipes } />
                        <Route exact path="/recipe/:id" component={ RecipeDetails } />
                        <Route path={[ '/recipe', '/recipe/*/*' ]}>
                            <Redirect to="/recipes" />
                        </Route>
                        <Route exact path="/coming-soon" component={ ComingSoon } />
                        <Route component={ NotFoundPage } />
                    </Switch>
                </Suspense>
            </ContentWrapper>
        </Container>
    );
}

export default App;
