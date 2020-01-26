import styled from 'styled-components';
import { RECIPE_CARD_GUTTER_SIZE } from '../../constants';

export const CenterItemWrapper = styled.div`
    width: calc( 100vw - ${RECIPE_CARD_GUTTER_SIZE * 2}px );
    height: ${ ({ height }) => height }px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .search-input {
        margin: 10px 0;
    }

    .MuiFab-root {
        position: fixed;
        bottom: 8px;
        right: 8px;
    }
`;
