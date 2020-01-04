import styled from 'styled-components';
import { RECIPE_CARD_GUTTER_SIZE } from '../../constants';

export const LoaderWrapper = styled.div`
    width: calc( 100vw - ${RECIPE_CARD_GUTTER_SIZE * 2}px );
    height: ${ ({ height }) => height }px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const Wrapper = styled.div`
    width: 100%;

    .search-input {
        margin: 10px 0;
    }
`;
