import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import {
    Editor,
    EditorState,
    convertFromRaw
} from 'draft-js';
import { isIOS } from 'react-device-detect';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Chip from '@material-ui/core/Chip';
import Fab from '@material-ui/core/Fab';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import MoreVert from '@material-ui/icons/MoreVert';
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';
import startCase from 'lodash/startCase';

import { LIKE_FILL_COLOR, LIKED_RECIPES } from '../../constants';
import Loader from '../../components/Loader';
import { toHSL } from '../../utils/stringToColor';
import { useLocalStorage } from '../../utils/hooks';

import { LoaderWrapper, Wrapper, ContentWrapper, StyledCardContent } from './styles';
import Ingredients from './Ingredients';

const BindKeyboardSwipeableViews = bindKeyboard( SwipeableViews );

const GET_RECIPE = gql`
    query recipe( $id: ID! ) {
        recipe( id: $id ) {
            id
            name
            description
            photo
            instructions
            ingredients {
                quantity
                ingredient {
                    id
                    name
                }
            }
            tags {
                id
                name
            }
        }
    }
`;

/**
 * Recipe component
 */
function Recipe() {
    const { id } = useParams();
    const history = useHistory();
    const { state: { from } = {} } = useLocation();
    const [ likedRecipes, setLikedRecipes ] = useLocalStorage( LIKED_RECIPES, [] );
    const likedRecipesSet = new Set( likedRecipes );

    const [ optionsAnchorEl, setOptionsAnchorEl ] = useState( null );
    const [ selectedTab, setSelectedTab ] = useState( 0 );
    const [ editorState, setEditorState ] = useState( EditorState.createEmpty());

    const isPopoverOpen = Boolean( optionsAnchorEl );

    function handleBackClick() {
        history.push( from || '/recipes' );
    }

    function handleOptionsClick( event ) {
        setOptionsAnchorEl( event.currentTarget );
    };
    
    function handleOptionsPopoverClose() {
        setOptionsAnchorEl( null );
    };

    function handleLikeClick() {
        if ( likedRecipesSet.has( id )) {
            likedRecipesSet.delete( id );
        } else {
            likedRecipesSet.add( id );
        }
        setLikedRecipes( Array.from( likedRecipesSet ));
    }

    function handleEditClick() {
        history.push( `/recipe/${id}/edit` );
    }

    function handleSelectTab( event, tabIndex ) {
        setSelectedTab( tabIndex );
    }

    function handleChangeIndex( index ) {
        setSelectedTab( index );
    }

    const {
        data: {
            recipe: {
                name,
                description,
                photo,
                instructions,
                ingredients,
                tags
            } = {}
        } = {},
        loading
    } = useQuery( GET_RECIPE, {
        variables: { id }
    });

    useEffect(() => {
        if ( instructions ) {
            const newEditorState = EditorState.createWithContent( convertFromRaw( JSON.parse( instructions )));
            setEditorState( newEditorState );
        }
    }, [instructions])

    return (
        loading ? (
            <LoaderWrapper>
                <Loader />
            </LoaderWrapper>
        ) : (
            <Wrapper>
                <Helmet>
                    <title>Recipe - { name }</title>
                    <meta name="description" content={ `${name} recipe` } />
                    <meta name="description" content={ description } />
                </Helmet>
                <Card square>
                    <CardMedia
                        image={ photo }
                        title={ name }
                    >
                        <div>
                            <Fab onClick={ handleBackClick } size="small">
                                { isIOS ? <ArrowBackIos style={{ marginLeft: '8px' }} /> : <ArrowBack /> }
                            </Fab>
                        </div>
                    </CardMedia>
                    <StyledCardContent>
                        <Typography component="h6" variant="h6" color="textPrimary">
                            { name }
                        </Typography>
                        <div className="action-wrapper">
                            <IconButton onClick={ handleLikeClick }>
                                { likedRecipesSet.has( id )
                                    ? <Favorite style={{ fill: LIKE_FILL_COLOR }} />
                                    : <FavoriteBorder style={{ fill: LIKE_FILL_COLOR }} />
                                }
                            </IconButton>
                            <IconButton onClick={ handleOptionsClick }>
                                <MoreVert />
                            </IconButton>
                            <Popover
                                open={ isPopoverOpen }
                                anchorEl={ optionsAnchorEl }
                                onClose={ handleOptionsPopoverClose }
                                anchorOrigin={{
                                    vertical: 'center',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <Button onClick={ handleEditClick }>
                                    Edit
                                </Button>
                            </Popover>
                        </div>
                    </StyledCardContent>
                </Card>

                <ContentWrapper>
                    <Typography className="description" component="p" variant="caption">
                        { description }
                    </Typography>

                    { tags.map(( tag ) => (
                        <Chip
                            key={ tag.id }
                            style={{
                                backgroundColor: toHSL( tag.id ),
                                margin: '0 4px 4px 0'
                            }}
                            size="small"
                            label={ startCase( tag.name ) }
                        />
                    )) }
                </ContentWrapper>

                <Paper>
                    <Tabs
                        value={ selectedTab }
                        onChange={ handleSelectTab }
                        indicatorColor="primary"
                        textColor="inherit"
                        variant="fullWidth"
                    >
                        <Tab label="Ingredients" />
                        <Tab label="Instructions" />
                    </Tabs>
                </Paper>
                <BindKeyboardSwipeableViews index={ selectedTab } onChangeIndex={ handleChangeIndex } animateHeight>
                    <ContentWrapper>
                        <Ingredients ingredients={ ingredients } />
                    </ContentWrapper>
                    <ContentWrapper>
                        <Editor
                            readOnly
                            editorState={ editorState }
                        />
                    </ContentWrapper>
                </BindKeyboardSwipeableViews>
            </Wrapper>
        )
    );
}

export default Recipe;