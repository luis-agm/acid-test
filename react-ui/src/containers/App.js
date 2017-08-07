import React, { Component } from 'react'
import io from 'socket.io-client'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as StockActions from '../redux/modules/stocks'
import StockList from '../components/stockList'
import '../styles/App.css'

const socket = io()

class App extends Component {
  constructor ( props ) {
    super( props )
    socket.on( 'newResults', results => {
      console.log( 'wat' )
      this.props.actions.setStocks( results )
      console.log( this.props.stocks )
    } )
    socket.emit( 'getStocks' )
  }
  render () {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Stocks App</h2>
        </div>
        <div className='App-content'>
          <StockList stocks={this.props.stocks}/>
        </div>
      </div>
    )
  }
}

function mapStateToProps ( state ) {
  return {
    stocks: state.stocks.all,
    current: state.stocks.current
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    actions: bindActionCreators( StockActions, dispatch )
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( App )
