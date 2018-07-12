import React, { Component } from 'react';
import ReactTable from 'react-table'
import Axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  /*render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }*/
  constructor(props){
    super(props);
    this.state={
      customers:[],
      transactions:[],
      predictions:[],
      loadingPrediction:false,
      selectedCustomer:{id:'',name:''},

    }
    this._getCustomerTransactions=this._getCustomerTransactions.bind(this);
    this._predictCustomerNextTransaction=this._predictCustomerNextTransaction.bind(this);
  }
  
  componentDidMount(){
    let customer_config={
      method:'get',
      url:'http://localhost:8079/graphql',
      params:{
        query:'{customers{id name}}'
      }
    }
    Axios(customer_config).then(response=>{
      //console.log(response);
      this.setState({
        customers:response.data.data.customers
      });
    })
  }
  
  _getCustomerTransactions=({id,pageSize,page})=>{
    let config={
      method:'get',
      url:'http://localhost:8079/graphql',
      params:{
        query:'{transactions(customerId:"'+id+'"){id customerId type amount balance}}'
      }
    }
    Axios(config).then(response=>{
      this.setState({
        transactions:response.data.data.transactions
      });
    })
  }

  _predictCustomerNextTransaction=({id})=>{
    let config={
      method:'get',
      url:'http://localhost:8079/graphql',
      params:{
        query:'{predict(customerId:"'+id+'"){amount}}'
      }
    }
    this.setState({loadingPrediction:true})
    Axios(config).then(response=>{
      this.setState({
        predictions:response.data.data.predict,
        loadingPrediction:false
      });
    })
  }

  render() {
    const customer_columns = [{
      Header: 'ID',
      accessor: 'id'
    }, {
      Header: 'Name',
      accessor: 'name',
    }];



    const transaction_columns=[{
      Header: 'ID',
      accessor: 'id'
    },{
      Header: 'Customer',
      accessor: 'customerId'
    },{
      Header: 'Type',
      accessor: 'type'
    },{
      Header: 'Amount',
      accessor: 'amount'
    },{
      Header: 'Balance',
      accessor: 'balance'
    },];
    const predict_column=[{
      Header:'Amount',
      accessor:'amount',
    }]
    //const transaction_columns
  
    return(      
      <div className="App">
      <header className="App-header">
        <h1 className="App-title">Code Challenge</h1>
      </header>
      <div style={{marginLeft:50,textAlign:'left'}}>

      <div style={{display:'flex'}}>
        <div>
          <h1 className="App-title">Customers</h1>
          <MyTable
            style={{width:'100%'}}
            pageSize={5}
                data={this.state.customers}
                columns={customer_columns}
                getTdProps={(state, rowInfo, column, instance) => {
                  return {
                    onClick: (e, handleOriginal) => {
                      if(this.state.loadingPrediction){
                        return;
                      }
                      if(rowInfo){
                        let customer=rowInfo.original;
                        this.setState({
                          selectedCustomer:customer
                        })
                        this._getCustomerTransactions({id:customer.id,page:0,pageSize:20});
                        this._predictCustomerNextTransaction({id:customer.id});
                      }

                    }
                  };
                }}/>
          </div>
          <div style={{marginLeft:20}}>
          <h1 className="App-title">{'RNN Prediction for ' + this.state.selectedCustomer.name}</h1>
            <MyTable
              loading={this.state.loadingPrediction}
              pageSize={1}
              showPagination={false}
              data={this.state.predictions}
              columns={predict_column}/>
            </div>
          </div>
        <h1 className="App-title">{'Transactions ' + this.state.selectedCustomer.name}</h1>
        <MyTable
         style={{width:'90%'}}
          data={this.state.transactions}
          pageSize={10}
          columns={transaction_columns}/>
          </div>
      </div>
  );
  }
}
class MyTable extends Component{
  constructor(props){
    super(props)
    this.state={
      pageSize:this.props.pageSize||10,
      data:this.props.data,
    }
  }
  componentWillReceiveProps(newProps){
    this.setState({
      data:newProps.data,
    })
  }
  render(){
    return(<ReactTable
      {...this.props}
      data={this.state.data}
      columns={this.props.columns}/>
    );
  }
}

export default App;
