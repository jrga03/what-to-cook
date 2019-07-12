import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

import { Wrapper, StyledButtonBase } from './styles';

const CATEGORIES = [ 'Pork', 'Chicken', 'Beef', 'Seafood', 'Pasta', 'Vegetables', 'Beverages', 'Desserts', 'Others' ];

/**
 * Dashboard
 */
function Dashboard( props ) {
    return (
        <Wrapper>
            <ul>
                { CATEGORIES.map(( category ) => (
                    <StyledButtonBase
                        key={ category }
                        component="li"
                        onClick={ () => props.history.push( `/recipes/${category}`.toLowerCase()) }
                    >
                        <div>
                            <Typography variant="h6">
                                { category }
                            </Typography>
                        </div>
                    </StyledButtonBase>
                )) }
            </ul>
        </Wrapper>
    );
}

Dashboard.propTypes = {
    history: PropTypes.object.isRequired
}

export default withRouter( Dashboard )