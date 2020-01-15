import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

export const StyledCardWrapper = styled.div`
    .link {
        text-decoration: none;
    }
`;

export const StyledCard = styled( Card )`
    display: flex;
    height: 100%;
`;

export const StyledCardMedia = styled( CardMedia )`
    width: 35%;
    padding-top: 4px;
    padding-left: 4px;
`;

export const StyledCardContent = styled( CardContent )`
    display: flex;
    width: calc( 65% - 32px );
    flex-direction: column;
    justify-content: space-between;
`;

export const TextWrapper = styled.div`
    width: 100%;

    .recipe-name {
        line-height: 1;
        font-size: 1rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .recipe-description {
        --lh: 1rem;
        --max-lines: 2;
        overflow: hidden;
        position: relative;
        line-height: var( --lh );
        max-height: calc( var( --lh ) * var( --max-lines ));
        text-align: justify;
        margin-right: -1em;
        padding-right: 1em;

        &:before {
            content: '...';
            position: absolute;
            right: 0;
            bottom: 0;
        }

        &:after {
            content: '';
            position: absolute;
            right: 0;
            width: 1em;
            height: 1em;
            margin-top: 0.2em;
            background: white;
        }
    }
`;

export const TagsWrapper = styled.div`
    width: 100%;
    white-space: nowrap;
    overflow: auto;

    &::-webkit-scrollbar {
        display: none;
    }

    .MuiChip-root {
        margin-right: 2px;
    }
`;