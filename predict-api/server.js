const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	{ graphqlExpress } = require('apollo-server-express'),
	{ makeRemoteExecutableSchema, introspectSchema } = require('graphql-tools'),
	schema = require('./schema');

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
const PORT = process.env.PORT || 8084;
app.listen(PORT, () => console.log('Prediction API listening on port:' + PORT));
