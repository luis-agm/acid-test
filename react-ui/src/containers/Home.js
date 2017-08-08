import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import findInArray from 'lodash/find'
import * as StockActions from '../redux/modules/stocks'
import * as SocketActions from '../redux/modules/socket'
import StockList from '../components/StockList'
import '../styles/Home.css'

class Home extends Component {
  constructor ( props ) {
    super( props )
    this.setCurrentStock = this.setCurrentStock.bind( this )
  }

  componentWillMount () {
    // Sockets events
    this.props.socket.on( 'newResults', results => {
      if ( this.props.error ) this.props.actions.clearError()
      this.props.actions.setStocks( results )
    } )
    this.props.socket.on( 'firstResults', results => {
      if ( this.props.error === 'API' ) this.props.actions.clearError()
      this.props.actions.setStocks( results )
    } )
    this.props.socket.on( 'APIerror', () => {
      this.props.actions.setError( 'API' )
    } )
    this.props.socket.on( 'marketClosed', () => {
      this.props.actions.setError( 'CLOSED' )
    } )
  }

  setCurrentStock ( id ) {
    return this.props.actions.setCurrent( findInArray( this.props.stocks, { id } ) )
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
    current: state.stocks.currentStock,
    error: state.stocks.error,
    socket: state.socket.socket
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    actions: bindActionCreators( Object.assign( {}, StockActions, SocketActions ), dispatch )
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( Home )
