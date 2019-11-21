import styled from 'styled-components';

const Wrapper = styled.main`
    max-width: 960px;
    width: 100vw;
    padding-top: 3vw;

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
