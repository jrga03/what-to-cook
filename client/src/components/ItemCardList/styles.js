import styled from 'styled-components';
import GridList from '@material-ui/core/GridList';

const StyledGridList = styled( GridList )`
&& {
    padding: 3vw 4px;
    margin: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
}
`;

export default StyledGridList;
