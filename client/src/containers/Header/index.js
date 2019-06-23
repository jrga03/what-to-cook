import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import ButtonBase from '@material-ui/core/ButtonBase';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import toLower from 'lodash/toLower';

import { StyledAppBar, StyledToolbar, Container } from './styles';

const CATEGORIES = [ 'Pork', 'Chicken', 'Beef', 'Seafood', 'Pasta', 'Vegetables', 'Beverages', 'Desserts', 'Others' ];

/**
 * Header componnent
 */
function Header ( props ) {
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

    return (
        <StyledAppBar position="fixed">
            <StyledToolbar>
                <ButtonBase onClick={ () => props.history.push( '/' ) }>
                    <Typography variant="h6" noWrap>
                        What To Cook
                    </Typography>
                </ButtonBase>
                <Container>
                    <Button onClick={ () => { /* TODO: surprise function */ } }>
                        Surprise Me!
                    </Button>
                    <Button
                        ref={ anchorRef }
                        aria-controls="recipe-list-grow"
                        aria-haspopup="true"
                        onClick={ handleToggle }
                    >
                            Recipes
                        { open ? <ExpandLess /> : <ExpandMore /> }
                    </Button>
                    <Popper
                        open={ open }
                        anchorEl={ anchorRef.current }
                        transition
                        disablePortal
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                { ...TransitionProps }
                                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                            >
                                <Paper id="menu-list-grow">
                                    <ClickAwayListener onClickAway={ handleClose }>
                                        <MenuList>
                                            <NavLink
                                                exact
                                                to="/recipes"
                                                aria-current="true"
                                                activeClassName="active"
                                            >
                                                <MenuItem onClick={ handleClose }>
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
                                                    <MenuItem onClick={ handleClose }>
                                                        { category }
                                                    </MenuItem>
                                                </NavLink>
                                            )) }
                                            {/* <MenuItem onClick={ handleClose }>Pork</MenuItem>
                                            <MenuItem onClick={ handleClose }>Chicken</MenuItem>
                                            <MenuItem onClick={ handleClose }>Beef</MenuItem>
                                            <MenuItem onClick={ handleClose }>Seafood</MenuItem>
                                            <MenuItem onClick={ handleClose }>Pasta</MenuItem>
                                            <MenuItem onClick={ handleClose }>Vegetables</MenuItem>
                                            <MenuItem onClick={ handleClose }>Beverages</MenuItem>
                                            <MenuItem onClick={ handleClose }>Desserts</MenuItem>
                                            <MenuItem onClick={ handleClose }>Others</MenuItem> */}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                    <div />
                </Container>
                <Button onClick={ () => { /* TODO: surprise function */ } }>
                    Add a Recipe
                </Button>
            </StyledToolbar>
        </StyledAppBar>
    );
}

Header.propTypes = {
    history: PropTypes.object.isRequired
}

export default withRouter( Header );
