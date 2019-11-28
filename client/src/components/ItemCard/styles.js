import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import CheckCircle from '@material-ui/icons/CheckCircle';

export const StyledCard = styled( Card )`
&& {
    position: relative;

    .MuiCardContent-root {
        display: flex;
        flex-direction: column;
        padding: calc( 4% + 4px );
        height: ${({ width }) => width - 5}vw;
        width: ${({ width }) => width}vw;
    }

    .MuiTypography-root {
        flex: 0;
        line-height: unset;
    }
}
`;

export const CardMediaWrapper = styled.div`
    flex: 1;

    .MuiCardMedia-root {
        height: 100%;
    }
`;

export const StyledCheckCircle = styled( CheckCircle )`
    position: absolute;
    top: 4px;
    right: 4px;
    fill: #ffffff;
`;
