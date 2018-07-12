const { makeExecutableSchema } = require('graphql-tools');
const transactions = require('../database/transactions');

// SCHEMA DEFINITION
const typeDefs = `
type Query {
	transactions(id:ID, customerId:String, amount:Float, first:Int, offset:Int):[Transaction]
}

type Transaction {
  id: ID!
  customerId: String
	type: String,
	amount:Float,
	balance:Float
}`

// RESOLVERS
const resolvers = {
	Query: {
		transactions:(root, args, context, info)=>{
			let first=transactions.length;
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
			let data=transactions.filter(item=>{
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
})