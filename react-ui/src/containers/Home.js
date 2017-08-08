import React, { Component } from 'react'
import io from 'socket.io-client'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as StockActions from '../redux/modules/stocks'
import StockList from '../components/stockList'
import '../styles/Home.css'

const socket = io()

class Home extends Component {
  constructor ( props ) {
    super( props )

    this.setCurrentStock = this.setCurrentStock.bind( this )
  }

  componentWillMount () {
    // Sockets events
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

  setCurrentStock ( id ) {
    return this.props.actions.setCurrent( id )
  }

  render () {
    return (
      <div className="Home">
        <div className='Home-content'>
          { this.props.error === 'API' && <span className='warning-message'>An error has occured while getting your stocks.</span>}
          { this.props.error === 'CLOSED' && <span className='warning-message'>Market closed. We will refresh results once the market opens.</span>}
          <StockList stocks={this.props.stocks} selectStock={this.setCurrentStock}/>
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

export default connect( mapStateToProps, mapDispatchToProps )( Home )
