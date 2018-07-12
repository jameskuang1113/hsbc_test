const { makeExecutableSchema } = require('graphql-tools');
const transactions = require('../database/transactions');
const regression= require('regression');
const brain = require('brain.js');
// SCHEMA DEFINITION
const typeDefs = `
type Query {
	predict(customerId:ID!):[Transaction]
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
		predict:(root,args,context,info)=>{
			let data=transactions.filter(item=>(item.customerId===args.customerId && item.type=='withdrawal'));
			let raw=data.map((d,index)=>d.amount);
			let input=[];
			while(raw.length>=7){
				input.push(raw.splice(0,7));
			}
			console.log(input);
			let net = new brain.recurrent.RNNTimeStep();
			net.train(input);
			//var output1 = net.run(raw.slice(0,raw.length-1));  // 3
			var output = net.run(raw);  // 3
			return [{
				amount:output
			}];
		}
	},
}

// (EXECUTABLE) SCHEMA
module.exports = makeExecutableSchema({
	typeDefs,
	resolvers
})