import React, { Component } from 'react'
import StockItem from './StockItem'
import '../styles/StockList.css'

class stockList extends Component {
  shouldComponentUpdate ( newProps ) {
    return this.props !== newProps
  }
  render () {
    const items = this.props.stocks.map( ( item ) => {
      return ( <StockItem key={item.id} stock={item} selectCurrent={this.props.selectStock}/> )
    } )
    return (
      <div className='stock-list'>
        { items }
      </div>
    )
  }
}

export default stockList
