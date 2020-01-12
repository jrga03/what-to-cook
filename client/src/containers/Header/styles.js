import styled, { css } from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuList from '@material-ui/core/MenuList';

const linkStyles = css`
    a {
        text-decoration: none;
        color: rgba(0, 0, 0, 0.87);
    }

    .active {
        color: #fff;

        li {
            background-color: #9acffa;
        }
    }

    .link {
        text-transform: uppercase;
    }
`;

export const StyledAppBar = styled( AppBar )`
    align-items: center;
`;

export const StyledToolbar = styled( Toolbar )`
    max-width: 960px;
    width: 100vw;
    padding-right: 5px;
    padding-left: 5px;

    & > a:first-of-type {
        padding-left: 10px;
        color: white;
    }

    button {
        color: #fff;
    }

    ${linkStyles}
`;

export const StyledMenuList = styled( MenuList )`
    ${linkStyles}
`;

export const Container = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: calc( 20px + 5vw );
    flex-grow: 1;

    button {
        margin-right: 10px;
    }
`;

export const DrawerContentContainer = styled.div`
    min-width: 120px;
    width: 60vw;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    h6 {
        padding-left: 4px;
        margin-bottom: 8px;
    }

    & > div, button {
        width: 100%;
    }

    button:not(:nth-child(2)) {
        display: flex;
        justify-content: flex-start;
    }

    button:nth-child(2) {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    button {
        padding-left: 13px;
    }

    ul {
        li {
            padding-left: 30px;
        }
    }
`;
