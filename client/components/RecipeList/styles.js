import styled from 'styled-components';

const Wrapper = styled.nav`
    position: relative;
    width: 100%;
`;

const ScrollWrapper = styled.div`
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    padding-right: 20px;
`;

export { Wrapper, ScrollWrapper };