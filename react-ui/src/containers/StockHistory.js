import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import * as StockActions from '../redux/modules/stocks'
import PriceList from '../components/PriceList'
import '../styles/StockHistory.css'

class StockHistory extends Component {
  componentWillMount () {
    this.props.socket.on( 'priceHistory', ( priceHistory ) => {
      console.log( 'it is passing' )
      this.props.actions.setCurrentPrices( priceHistory )
    } )
    this.props.socket.on( 'newPrice', ( newPrice ) => {
      this.props.actions.updateCurrentPrices( newPrice )
    } )
    this.props.socket.emit( 'getHistory', this.props.current.id )
    console.log( 'THISONE', this.props.current.id )
  }
  componentWillUnmount () {
    this.props.socket.emit( 'stopUpdatingHistory', this.props.current.id )
    this.props.actions.clearCurrent()
  }
  render () {
    return (
      <div className='Stock-history'>
        <Link to='/' className='Stock-history__home-link'>Home</Link>
        <PriceList stock={this.props.current} prices={ this.props.prices }/>
      </div>
    )
  }
}

function mapStateToProps ( state ) {
  return {
    current: state.stocks.currentStock,
    prices: state.stocks.currentPrices,
    error: state.stocks.error,
    socket: state.socket.socket
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    actions: bindActionCreators( StockActions, dispatch )
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( StockHistory )
