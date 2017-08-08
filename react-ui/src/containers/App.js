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
      if ( this.props.error ) this.props.actions.clearError()
      this.props.actions.setStocks( results )
      console.log( this.props.stocks )
    } )
    socket.on( 'firstResults', results => {
      if ( this.props.error === 'API' ) this.props.actions.clearError()
      this.props.actions.setStocks( results )
      console.log( this.props.stocks )
    } )
    socket.on( 'APIerror', () => {
      this.props.actions.setError( 'API' )
    } )
    socket.on( 'marketClosed', () => {
      this.props.actions.setError( 'CLOSED' )
    } )
  }
  render () {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Stocks App</h2>
        </div>
        <div className='App-content'>
          { this.props.error === 'API' && <span className='warning-message'>An error has occured while getting your stocks.</span>}
          { this.props.error === 'CLOSED' && <span className='warning-message'>Market closed. We will refresh results once the market opens.</span>}
          <StockList stocks={this.props.stocks}/>
        </div>
      </div>
    )
  }
}

function mapStateToProps ( state ) {
  return {
    stocks: state.stocks.all,
    current: state.stocks.current,
    error: state.stocks.error
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    actions: bindActionCreators( StockActions, dispatch )
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( App )
