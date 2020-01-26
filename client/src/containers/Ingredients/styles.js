import styled from 'styled-components';

const CONTAINER_PADDING = 4;
export const TOTAL_CONTAINER_PADDING = CONTAINER_PADDING * 2;

export const Wrapper = styled.main`
    max-width: 960px;
    width: 100vw;
    height: 100%;

    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    }

    .MuiSnackbarContent-root {
        flex-grow: 0;
    }
`;

export const ContentWrapper = styled.div`
    padding: ${CONTAINER_PADDING}px;

    .MuiInput-root {
        margin-bottom: 8px;
    }

    .MuiListItemIcon-root {
        min-width: 0;
    }

    .list > ul {
        margin: 0;
        padding: 0;
    }
`;
