const express = require('express'),
	app = express(),
	PORT = process.env.PORT || 8079,
	bodyParser = require('body-parser'),
	{ graphqlExpress } = require('apollo-server-express'),
	{ mergeSchemas } = require('graphql-tools'),
	{ getIntrospectSchema } = require('./introspection');
const cors=require('cors');
//graphql endpoints
const endpoints = [
	'http://localhost:8082/graphql',
	'http://localhost:8083/graphql',
	'http://localhost:8084/graphql',
];
(async function () {
	try {
		//promise.all to grab all remote schemas at the same time, we do not care what order they come back but rather just when they finish
		allSchemas = await Promise.all(endpoints.map(ep => getIntrospectSchema(ep)));
		//create function for /graphql endpoint and merge all the schemas
		app.use('/graphql', cors({origin:'http://localhost:3000',credentials:true}),bodyParser.json(), graphqlExpress({ schema: mergeSchemas({ schemas: allSchemas }) }));
		//start up a graphql endpoint for our main server
		app.listen(PORT, () => console.log('GraphQL API listening on port:' + PORT));
	} catch (error) {
		console.log('ERROR: Failed to grab introspection queries', error);
	}
})();


