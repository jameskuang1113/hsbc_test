const { makeExecutableSchema } = require('graphql-tools');
const customers = require('../database/customers');

// SCHEMA DEFINITION
const typeDefs = `
type Query {
  customers(id: ID, name:String, first:Int, offset:Int): [Customer]
}
type Customer {
  id: ID!
  name: String
}`

// RESOLVERS
const resolvers = {
	Query: {
		customers: (root, args, context, info) => {
			let first=customers.length;
			let offset=0;
			if(args.hasOwnProperty('first')){
				first=args.first;
				delete args.first;
			}
			if(args.hasOwnProperty('offset')){
				offset=args.offset;
				delete args.offset;
			}
			let keys=Object.keys(args);
			let data=customers.filter(item=>{
				let keep=true;
				keys.forEach(key=>{
					keep=keep&&item.hasOwnProperty(key)&&item[key]==args[key];
				})
				return keep;
			});
			return data.slice(offset,offset+first); 
		},
	},
}

// (EXECUTABLE) SCHEMA
module.exports = makeExecutableSchema({
	typeDefs,
	resolvers
});