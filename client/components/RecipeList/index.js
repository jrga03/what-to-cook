import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import burger from '../../images/burgers.jpg';

// import { Wrapper, ScrollWrapper } from './styles';
import RATIO from './constants'
import MOCK_RECIPES from './mockList';

// import RecipeCard from '../RecipeCard';

const styles = ( theme ) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper
    },
    gridList: {
        width: '100%',
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)'
    },
    title: {
        color: theme.palette.primary.light
    },
    titleBar: {
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
    },
    image: {
        objectFit: 'cover'
    }
})

class RecipeList extends PureComponent {
    static propTypes = {
        recipes: PropTypes.array,
        classes: PropTypes.object.isRequired
    };

    static defaultProps = {
        recipes: MOCK_RECIPES
    }

    constructor( props ) {
        super( props );
        this.state = {
            width: window.innerWidth,
            columns: this.computeColumns( window.innerWidth )
        }
    }

    componentDidMount() {
        window.addEventListener( 'resize', this.updateWindowDimensions );
    }

    componentWillUnmount() {
        window.removeEventListener( 'resize', this.updateWindowDimensions );
    }

    componentDidUpdate( prevProps, prevState ) {
        if ( prevState.width !== this.state.width ) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState(( state ) => ({ columns: this.computeColumns( state.width ) }))
        }
    }

    computeColumns = ( w ) => ( w * RATIO )

    updateWindowDimensions = () => this.setState({ width: window.innerWidth });

    render() {
        const { classes, recipes } = this.props;
        const { columns } = this.state;

        return (
            <div className={ classes.root }>
                <GridList className={ classes.gridList } cols={ columns }>
                    {
                        recipes.map(( recipe ) => (
                            <GridListTile key={ recipe.key }>
                                <img src={ burger } className={ classes.image } alt={ recipe.name } />
                                <GridListTileBar
                                    title={ recipe.name }
                                    classes={{
                                        root: classes.titleBar,
                                        title: classes.title
                                    }}
                                    actionIcon={
                                        <IconButton onClick={ () => {} }>
                                            <StarBorderIcon className={ classes.title } />
                                        </IconButton>
                                    }
                                />
                            </GridListTile>
                        ))
                    }
                </GridList>
                {/* <ScrollWrapper>
                    {
                        recipes.map(( recipe ) => (
                            <RecipeCard key={ recipe.key } name={ recipe.name } />
                        ))
                    }
                </ScrollWrapper> */}
            </div>
        );
    }
}

// const RecipeList = ( props ) => {
//     const { recipes, classes } = props;
//     const RATIO = 1.4 / 375;

//     const computeColumns = ( w ) => w * RATIO;

//     const [ width, setWidth ] = useState( window.innerWidth );
//     const [ columns, setColumns ] = useState( computeColumns( width ));

//     /**
//      * Triggers when window is resized
//      */
//     function updateWindowDimensions() {
//         setWidth( window.innerWidth )
//     }

//     useLayoutEffect(() => {
//         window.addEventListener( 'resize', updateWindowDimensions );

//         return () => {
//             window.removeEventListener( 'resize', updateWindowDimensions );
//         }
//     });

//     useEffect(() => {
//         setColumns( computeColumns( width ));
//     })

//     return (
//         <div className={ classes.root }>
//             <GridList className={ classes.gridList } cols={ columns }>
//                 {
//                     recipes.map(( recipe ) => (
//                         <GridListTile key={ recipe.key }>
//                             <img src={ recipe.image } className={ classes.image } alt={ recipe.name } />
//                             <GridListTileBar
//                                 title={ recipe.name }
//                                 classes={{
//                                     root: classes.titleBar,
//                                     title: classes.title
//                                 }}
//                                 actionIcon={
//                                     <IconButton onClick={ () => {} }>
//                                         <StarBorderIcon className={ classes.title } />
//                                     </IconButton>
//                                 }
//                             />
//                         </GridListTile>
//                     ))
//                 }
//             </GridList>
//             {/* <ScrollWrapper>
//                 {
//                     recipes.map(( recipe ) => (
//                         <RecipeCard key={ recipe.key } name={ recipe.name } />
//                     ))
//                 }
//             </ScrollWrapper> */}
//         </div>
//     );
// }

RecipeList.propTypes = {
    recipes: PropTypes.array,
    classes: PropTypes.object.isRequired
};

RecipeList.defaultProps = {
    recipes: MOCK_RECIPES
}

export default withStyles( styles )( RecipeList );