import React, { forwardRef, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation, useHistory, useRouteMatch } from 'react-router-dom';
import { useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Snackbar from '@material-ui/core/Snackbar';
import MenuIcon from '@material-ui/icons/Menu';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import toLower from 'lodash/toLower';
import get from 'lodash/get';
import { isMobileOnly } from 'react-device-detect';

import { CATEGORIES } from '../../constants';

import {
    StyledAppBar,
    StyledToolbar,
    StyledMenuList,
    Container,
    DrawerContentContainer
} from './styles';

const GET_RANDOM_RECIPE = gql`
    query {
        randomRecipe {
            id
        }
    }
`;

/**
 * Menu List component
 */
const MenuList = forwardRef(({ onClickItem }, ref ) => (
    <StyledMenuList ref={ ref }>
        <NavLink
            exact
            to="/recipes"
            aria-current="true"
            activeClassName="active"
            isActive={ ( match, location ) => match && location.search === '' }
        >
            <MenuItem onClick={ onClickItem }>
                All
            </MenuItem>
        </NavLink>
        { CATEGORIES.map(({ label: category }) => (
            <NavLink
                key={ category }
                exact
                to={ `/recipes?category=${toLower( category )}` }
                aria-current="true"
                activeClassName="active"
                isActive={ ( match, location ) => match && location.search.indexOf( toLower( category )) >= 0 }
            >
                <MenuItem onClick={ onClickItem }>
                    { category }
                </MenuItem>
            </NavLink>
        )) }
    </StyledMenuList>
) );

MenuList.propTypes = {
    onClickItem: PropTypes.func.isRequired
}

/**
 * Header for mobile devices
 */
function MobileHeader ({
    open,
    onClickSurpriseMe,
    recipesButtonRef,
    recipeListToggle,
    redirectTo
}) {
    const [ openDrawer, toggleDrawer ] = useState( false );

    /**
     * Handles drawer toggle
     * @param {Boolean} [state] - State of drawer
     * @returns {Function}
     */
    function handleToggleDrawer( state ) {
        if ( state !== undefined ) {
            return () => toggleDrawer( state );
        }
        return () => toggleDrawer(( prevStatus ) => !prevStatus );
    }

    function handleSurpriseMeClick() {
        toggleDrawer( false );
        onClickSurpriseMe();
    }

    return (
        <>
            <IconButton color="inherit" aria-label="Menu" onClick={ handleToggleDrawer( true ) }>
                <MenuIcon />
            </IconButton>
            <NavLink exact to="/">
                <Typography variant="h6" noWrap>
                    What To Cook
                </Typography>
            </NavLink>
            <SwipeableDrawer open={ openDrawer } onOpen={ handleToggleDrawer( true ) } onClose={ handleToggleDrawer( false ) }>
                <DrawerContentContainer>
                    <Typography variant="h6" noWrap>
                        What To Cook
                    </Typography>
                    <Button onClick={ handleSurpriseMeClick }>
                        Surprise Me!
                    </Button>
                    <Button
                        ref={ recipesButtonRef }
                        aria-controls="recipe-list-grow"
                        aria-haspopup="true"
                        onClick={ recipeListToggle }
                    >
                            Recipes
                        { open ? <ExpandLess /> : <ExpandMore /> }
                    </Button>
                    <Collapse in={ open } timeout="auto">
                        <MenuList onClickItem={ handleToggleDrawer( false ) } />
                    </Collapse>
                    <Button onClick={ redirectTo( '/categories', handleToggleDrawer( false ) ) }>
                        Categories
                    </Button>
                    <Button onClick={ redirectTo( '/ingredients', handleToggleDrawer( false ) ) }>
                        Ingredients
                    </Button>
                    <Button onClick={ redirectTo( '/recipe/add', handleToggleDrawer( false ) ) }>
                        Add a Recipe
                    </Button>
                    <div />
                </DrawerContentContainer>
            </SwipeableDrawer>
        </>
    );
}

MobileHeader.propTypes = {
    open: PropTypes.bool.isRequired,
    onClickSurpriseMe: PropTypes.func.isRequired,
    recipesButtonRef: PropTypes.object.isRequired,
    recipeListToggle: PropTypes.func.isRequired,
    redirectTo: PropTypes.func.isRequired
};

/**
 * Header for desktop
 */
function DesktopHeader ({
    open,
    onClickSurpriseMe,
    recipesButtonRef,
    recipeListToggle,
    recipeListClose,
    redirectTo
}) {
    const matchAddRecipe = useRouteMatch( '/recipe/add' );
    const isAddRecipe = matchAddRecipe && matchAddRecipe.isExact;

    return (
        <>
            <NavLink exact to="/">
                <Typography variant="h6" noWrap>
                    What To Cook
                </Typography>
            </NavLink>
            <Container>
                <Button onClick={ onClickSurpriseMe }>
                    Surprise Me!
                </Button>
                <Button
                    ref={ recipesButtonRef }
                    aria-controls="recipe-list-grow"
                    aria-haspopup="true"
                    onClick={ recipeListToggle }
                >
                        Recipes
                    { open ? <ExpandLess /> : <ExpandMore /> }
                </Button>
                <Popper
                    open={ open }
                    anchorEl={ recipesButtonRef.current }
                    transition
                    disablePortal
                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            { ...TransitionProps }
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                            <Paper id="menu-list-grow">
                                <ClickAwayListener onClickAway={ recipeListClose }>
                                    <MenuList onClickItem={ recipeListClose } />
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
                <div />
            </Container>
            { !isAddRecipe && (
                <Button onClick={ redirectTo( '/recipe/add' ) }>
                    Add a Recipe
                </Button>
            ) }
        </>
    );
}

DesktopHeader.propTypes = {
    open: PropTypes.bool.isRequired,
    onClickSurpriseMe: PropTypes.func.isRequired,
    recipesButtonRef: PropTypes.object.isRequired,
    recipeListToggle: PropTypes.func.isRequired,
    recipeListClose: PropTypes.func.isRequired,
    redirectTo: PropTypes.func.isRequired
};

/**
 * Header componnent
 */
function Header () {
    const location = useLocation();
    const history = useHistory();

    const [ open, setOpen ] = useState( false );
    const [ snackbar, setSnackbar ] = useState({
        open: false,
        message: ''
    });

    const anchorRef = useRef( null );

    const [ getRandomRecipe, { data }] = useLazyQuery( GET_RANDOM_RECIPE, { fetchPolicy: 'no-cache' });


    useEffect(() => {
        if ( data ) {
            const id = get( data, 'randomRecipe.id' );

            if ( id ) {
                history.push( `/recipe/${id}` );
            } else {
                setSnackbar({
                    open: true,
                    autoHideDuration: 3000,
                    message: 'No recipes available',
                    type: 'error'
                });
            }
        }
    }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * Toggles popover
     */
    function handleToggle() {
        setOpen(( prevOpen ) => !prevOpen );
    }

    /**
     * Handles popover close
     */
    function handleClose( event ) {
        if ( anchorRef.current && anchorRef.current.contains( event.target )) {
            return;
        }
        setOpen( false );
    }

    /**
     * Redirects to a random recipe
     */
    async function onClickSurpriseMe() {
        getRandomRecipe();
    }

    /**
     * Handles redirecting of route
     * @param {string} route - Route URL
     * @param {function} callback
     */
    function handleRedirectRoute( route, callback ) {
        return function() {
            callback && callback();
            if ( location.pathname !== route ) {
                history.push( route );
            }
        }
    }

    /**
     * Snack bar close event handler
     * @param {Object} event
     * @param {String} reason
     */
    function handleSnackbarClose( event, reason ) {
        if ( reason === 'clickaway' ) {
            return;
        }

        setSnackbar({
            open: false,
            message: ''
        });
    }

    const headerProps = {
        open,
        onClickSurpriseMe,
        recipesButtonRef: anchorRef,
        recipeListToggle: handleToggle,
        recipeListClose: handleClose,
        redirectTo: handleRedirectRoute
    };

    return (
        <StyledAppBar position="fixed" component="nav">
            <StyledToolbar>
                { isMobileOnly
                    ? <MobileHeader { ...headerProps } />
                    : <DesktopHeader { ...headerProps } />
                }
            </StyledToolbar>

            <Snackbar
                key={ snackbar.message }
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                open={ snackbar.open }
                onClose={ handleSnackbarClose }
                ContentProps={{
                    'aria-describedby': 'message-id',
                    style: snackbar.type === 'error' ? {
                        backgroundColor: '#ff5252'
                    } : {}
                }}
                message={ <span id="message-id">{ snackbar.message }</span> }
                autoHideDuration={ snackbar.autoHideDuration || null }
            />
        </StyledAppBar>
    );
}

export default Header;
