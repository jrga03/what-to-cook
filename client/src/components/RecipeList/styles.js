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
