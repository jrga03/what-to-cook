/* eslint-disable import/order */
const express = require( 'express' );
const models = require( './models' );
const expressGraphQL = require( 'express-graphql' );
const mongoose = require( 'mongoose' );
const session = require( 'express-session' );
const MongoStore = require( 'connect-mongo' )( session );
const schema = require( './schema/schema' );
const path = require( 'path' );

// Create a new Express application
const app = express();
app.use( express.static( path.join( __dirname, 'build' )));

const DB_USER = 'jason';
const DB_PASSWORD = '123qweasd';
const DB_SECRET = 'aaabbbccc';

// Replace with your mongoLab URI
// const MONGO_URI = 'mongodb+srv://jason:123qweasd@cluster0-fbf2a.gcp.mongodb.net/whattocookdb?retryWrites=true';
const MONGO_URI = `mongodb://${DB_USER}:${DB_PASSWORD}@cluster0-shard-00-00-fbf2a.gcp.mongodb.net:27017,cluster0-shard-00-01-fbf2a.gcp.mongodb.net:27017,cluster0-shard-00-02-fbf2a.gcp.mongodb.net:27017/whattocookdb?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`;

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
    secret: DB_SECRET,
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

app.get( '/*', function ( req, res ) {
    res.sendFile( path.join( __dirname, 'build', 'index.html' ));
});

const PORT = 4000;
app.listen( PORT, () => {
    console.log( `Listening to port ${PORT}` );
});
