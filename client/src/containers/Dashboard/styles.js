import styled from 'styled-components';

const Wrapper = styled.div`
    width: 100vw;

    .content {
        display: flex;
        justify-content: center;
        overflow-y: scroll;
        overflow-x: hidden;
        height: calc( 100vh - 104px );

        @media screen and (orientation: landscape) {
            height: calc( 100vh - 96px );
        }

        @media screen and (min-width: 600px) {
            height: calc( 100vh - 112px );
        }
    }
`;

export default Wrapper;
