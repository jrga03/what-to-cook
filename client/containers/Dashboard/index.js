import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
// import ListItem from '@material-ui/core/ListItem';

import Wrapper from './styles';

import RecipeList from '../../components/RecipeList';

const styles = {
    root: {
        width: '100%',
        position: 'relative',
        overflow: 'auto'
    },
    ul: {
        padding: 0
    }
};

/* eslint-disable-next-line react/prefer-stateless-function */
class Dashboard extends PureComponent {
    static propTypes = {
        classes: PropTypes.object
    }

    render() {
        const { classes } = this.props;

        return (
            <Wrapper>
                <List className={ classes.root } subheader={ <li /> }>
                    {[ 0, 1, 2, 3, 4, 5 ].map(( sectionId ) => (
                        <li key={ `section-${sectionId}` }>
                            <ul className={ classes.ul }>
                                <ListSubheader>{`Subheader ${sectionId}`}</ListSubheader>
                                <RecipeList />
                            </ul>
                        </li>
                    ))}
                </List>
            </Wrapper>
        );
    }
}

export default withStyles( styles )( Dashboard );