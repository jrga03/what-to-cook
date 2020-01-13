import styled from 'styled-components';

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
        h6 {
            margin: 0;
        }
    }
`;

export const ContentWrapper = styled.div`
    padding: 8px;
    flex: 1;
`;
