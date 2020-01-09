import styled from 'styled-components';

import { RECIPE_CARD_GUTTER_SIZE } from '../../../constants';

const TagsWrapper = styled.div`
    width: calc( 100vw - ${RECIPE_CARD_GUTTER_SIZE * 2}px );
    white-space: nowrap;
    overflow: auto;
    margin-bottom: 4px;

    &::-webkit-scrollbar {
        display: none;
    }

    .MuiChip-root {
        margin-right: 2px;
    }
`;

export default TagsWrapper;
