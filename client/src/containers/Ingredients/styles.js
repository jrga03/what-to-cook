import styled from 'styled-components';

const Wrapper = styled.main`
    max-width: 960px;
    width: 100vw;
    height: 100%;
    padding-top: 3vw;

    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    }

    .MuiGridList-root {
        padding: 0 4px;
        margin: 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-evenly;
    }
`;

export default Wrapper;
