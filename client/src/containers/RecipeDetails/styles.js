import styled from 'styled-components';
import CardContent from '@material-ui/core/CardContent';

export const LoaderWrapper = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const Wrapper = styled.main`
    position: relative;

    .MuiCard-root {
        width: 100vw;
    }

    .MuiCardMedia-root {
        width: 100%;
        display: flex;
        justify-content: space-between;
        height: 30vh;

        @media screen and (orientation: landscape) {
            height: 250px;
        }
    }

    .MuiCardContent-root {
        padding: 12px !important;

        h6 {
            margin: 0;
        }
    }
`;

export const ContentWrapper = styled.div`
    padding: 12px;
    flex: 1;
    width: calc( 100% - 24px );

    .description {
        margin: 12px 0;
    }
`;

export const StyledCardContent = styled( CardContent )`
    && {
        display: flex;
        justify-content: space-between;

        .action-wrapper {
            display: flex;
            align-items: flex-start;
        }
    }
`;
