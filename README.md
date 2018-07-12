Challenge:
"Imagine we have a simple customer database and another transactions database. We would like to expose the data as a RESTful API adopting a micro-services pattern. While also looking to simplify, we would like to implement a GraphQL interface.

Using the stack of your choice, build a database (any type) and build a REST API around it. Then unify the two APIs through a GraphQL one that we can test."

Bonus Microservice: Imagine a third service takes some of the transactions and using a ML model, predicts a specific amount to be spent by a user. Try integrating the live prediction.


Deliverables:
1. API for the customer database, API for the transactions database and GraphQL API 

2. GitHub link for the core code


HOW TO 

./database          // The mock data of our database
./gateway           // Source code of the microservice gateway in node js
./customer-api      // Source code of customer api microservice in node js
./transaction-api   // Source code of transaction api microservice in node js
./predict-api       // Source code of prediction microservice in node js; RNN is applied to implement prediction with brain.js.
./web               // Source code of the web dashboard in ReactJS

1. 'npm run install-all' will install all the required node_modules.
2. Start all 3 -api microservices('npm start') before starting the gateway service
3. Query can be made using Graphql api. 
   For example, to see all the customer data,
   - GET from customer microservice api 'http://localhost:8082/graphql?query={customers{id name}}' 
     or
   - GET from gateway 'http://localhost:8079/graphql?query={customers{id name}}' 

    To see all the transaction data,
   - GET from customer microservice api 'http://localhost:8083/graphql?query={transactions{id customerId amount type balance}}' 
     or
   - GET from gateway 'http://localhost:8079/graphql?query={transactions{id customerId amount type balance}}'

   Both customer and transaction data can be retrieved from the gateway at the same time, 
   'http://localhost:8079/graphql?query={customers{id name}transactions{id customerId amount type balance}}'

4. Under ./web, run 'npm start' to start the dashboard web.
5. The customer data are loaded into the table automatically.
6. Selecting a customer from the table will retrieve corresponding transaction data, and also start prediction.
7. The service will predict the amount of a customer's next spend.

HOW DATA IS STRUCTURED 

1. The mock data intends to simulate the daily spend of a customer.
2. The person will spend [50, 100] for 5(working) days, [200, 300] for 2(weekend) days, out of a week.
3. For simplicity, the data is duplicated for all the customers.
4. For Prediction, a RNN(within predict-api) will be trained with the data of a customer's spend.
5. It may take about 1 minute to train the RNN and the prediction result will be shown on the dashboard when a customer is selected.  