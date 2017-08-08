import React, { Component } from 'react'
import io from 'socket.io-client'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as StockActions from '../redux/modules/stocks'

const socket = io()

class StockHistory extends Component {
  componentDidMount () {
    socket.emit( 'getHistory', this.props.current )
  }
  render () {
    return (
      <div>
        Hello
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

export default connect( mapStateToProps, mapDispatchToProps )( StockHistory )
