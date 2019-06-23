import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

export const StyledAppBar = styled( AppBar )`
    align-items: center;
`;

export const StyledToolbar = styled( Toolbar )`
    max-width: 960px;
    width: 100vw;
    padding-right: 5px;
    padding-left: 5px;

    button:first-of-type {
        padding-left: 10px;
    }
`;

export const Container = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: calc( 20px + 5vw );
    flex-grow: 1;

    button {
        margin-right: 10px;
    }

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
`;
