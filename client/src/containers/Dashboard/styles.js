import styled from 'styled-components';
import ButtonBase from '@material-ui/core/ButtonBase';

export const Wrapper = styled.main`
    max-width: 960px;
    width: 100vw;
    padding-top: 3vw;

    ul {
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-evenly;
        padding: 5px;
    }
`;

export const StyledButtonBase = styled( ButtonBase )`
    && {
        border-radius: 10px;
        border: 2px solid #2196f3;
        margin-bottom: 50px;
        margin-right: 5vw;

        @media screen and ( max-width: 599px ) {
            &:nth-child( even ) {
                margin-right: 0;
            }
        }

        @media screen and ( min-width: 600px ) {
            &:nth-child( 3n+0 ) {
                margin-right: 0;
            }
        }
    }

    &&:hover {
        background-color: #9acffa;

        h6 {
            color: #fff;
        }
    }

    div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40vw;
        height: 40vw;
    }

    @media screen and ( min-width: 600px ) {
        div {
            width: 25vw;
            height: 25vw;
            max-height: 220px;
            max-width: 220px;
            min-height: 170px;
            min-width: 170px;
        }
    }
`;
