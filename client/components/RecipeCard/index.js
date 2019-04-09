import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import FastFoodIcon from '@material-ui/icons/FastfoodTwoTone';

const styles = ( theme ) => ({
    root: {
        padding: theme.spacing.unit
    },
    button: {},
    card: {
        width: 150,
        maxWidth: '50vw'
    },
    focusVisible: {}
});

const RecipeCard = ( props ) => (
    <div className={ props.classes.root }>
        <ButtonBase
            focusRipple
            className={ props.classes.button }
            focusVisibleClassName={ props.classes.focusVisible }
        >
            <Card raised className={ props.classes.card }>
                <CardHeader title={ props.name } />
                <CardContent>
                    <FastFoodIcon />
                </CardContent>
            </Card>
        </ButtonBase>
    </div>
)

RecipeCard.propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired
}

export default withStyles( styles )( RecipeCard );
