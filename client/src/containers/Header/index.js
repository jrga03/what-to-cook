import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
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
import MenuIcon from '@material-ui/icons/Menu';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import toLower from 'lodash/toLower';
import { isMobileOnly } from 'react-device-detect';

import { StyledAppBar, StyledToolbar, StyledMenuList, Container, DrawerContentContainer } from './styles';

const CATEGORIES = [ 'Pork', 'Chicken', 'Beef', 'Seafood', 'Pasta', 'Vegetables', 'Beverages', 'Desserts', 'Others' ];

/**
 * Renders Menu List
 */
function renderMenuList({ onClickItem }) {
    return (
        <StyledMenuList>
            <NavLink
                exact
                to="/recipes"
                aria-current="true"
                activeClassName="active"
            >
                <MenuItem onClick={ onClickItem }>
                    All
                </MenuItem>
            </NavLink>
            { CATEGORIES.map(( category ) => (
                <NavLink
                    key={ category }
                    exact
                    to={ `/recipes/${toLower( category )}` }
                    aria-current="true"
                    activeClassName="active"
                >
                    <MenuItem onClick={ onClickItem }>
                        { category }
                    </MenuItem>
                </NavLink>
            )) }
        </StyledMenuList>
    );
}

renderMenuList.propTypes = {
    onClickItem: PropTypes.func.isRequired
}

/**
 * Header for mobile devices
 */
function MobileHeader ({
    open,
    onClickSurpriseMe,
    recipesButtonRef,
    recipeListToggle
    // addRecipe
}) {
    const [ openDrawer, toggleDrawer ] = useState( false );

    /**
     * Handles drawer toggle
     * @param {Boolean} [state] - State of drawer
     */
    function handleToggleDrawer( state ) {
        if ( state !== undefined ) {
            return () => toggleDrawer( state );
        }
        return () => toggleDrawer(( prevStatus ) => !prevStatus );
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
                    <Collapse in={ open } timeout="auto">
                        { renderMenuList({ onClickItem: handleToggleDrawer( false ) }) }
                    </Collapse>
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
    recipeListToggle: PropTypes.func.isRequired
    // addRecipe: PropTypes.func.isRequired
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
    addRecipe
}) {
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
                                    { renderMenuList({ onClickItem: recipeListClose }) }
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
                <div />
            </Container>
            <Button onClick={ addRecipe }>
                Add a Recipe
            </Button>
        </>
    );
}

DesktopHeader.propTypes = {
    open: PropTypes.bool.isRequired,
    onClickSurpriseMe: PropTypes.func.isRequired,
    recipesButtonRef: PropTypes.object.isRequired,
    recipeListToggle: PropTypes.func.isRequired,
    recipeListClose: PropTypes.func.isRequired,
    addRecipe: PropTypes.func.isRequired
};

/**
 * Header componnent
 */
function Header () {
    const [ open, setOpen ] = useState( false );
    const anchorRef = useRef( null );

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

    const onClickSurpriseMe = () => console.log( 'SURPRISE!' );

    const addRecipe = () => console.log( 'ADD' );

    const headerProps = {
        open,
        onClickSurpriseMe,
        recipesButtonRef: anchorRef,
        recipeListToggle: handleToggle,
        recipeListClose: handleClose,
        addRecipe
    };

    return (
        <StyledAppBar position="fixed" component="nav">
            <StyledToolbar>
                { isMobileOnly
                    ? <MobileHeader { ...headerProps } />
                    : <DesktopHeader { ...headerProps } />
                }
            </StyledToolbar>
        </StyledAppBar>
    );
}

export default Header;
