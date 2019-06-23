/* eslint-disable import/order */
require('dotenv').config();
const express = require( 'express' );
const models = require( './models' );
const expressGraphQL = require( 'express-graphql' );
const mongoose = require( 'mongoose' );
const session = require( 'express-session' );
const MongoStore = require( 'connect-mongo' )( session );
const schema = require( './schema/schema' );
const path = require( 'path' );

const SESSION_SECRET = process.env.SESSION_SECRET;
const MONGO_URI = process.env.MONGO_URI;

// Create a new Express application
const app = express();
app.use( express.static( path.join( __dirname, 'client', 'build' )));

// Mongoose's built in promise library is deprecated, replace it with ES2015 Promise
mongoose.Promise = global.Promise;

// Connect to the mongoDB instance and log a message
// on success or failure
mongoose.connect( MONGO_URI, { useNewUrlParser: true });
mongoose.connection
    .once( 'open', () => console.log( 'Connected to MongoLab instance.' ))
    .on( 'error', ( error ) => console.log( 'Error connecting to MongoLab:', error ));

// Configures express to use sessions. This places an encrypted identifier
// on the users cookie. When a user makes a request, this middleware examines
// the cookie and modifies the request object to indicate which user made the request
// The cookie itself only contains the id of a session; more data about the session
// is stored inside of MongoDB.
app.use( session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
        url: MONGO_URI,
        autoReconnect: true
    })
}));

// Instruct Express to pass on any request made to the '/graphql' route
// to the GraphQL instance.
app.use( '/graphql', expressGraphQL({
    schema,
    graphiql: true
}));

app.use( '/*', function ( req, res ) {
    res.sendFile( path.join( __dirname, 'client', 'build', 'index.html' ));
});

module.exports = app;