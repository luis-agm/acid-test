import React from 'react'
import StockItem from './stockItem'
import '../styles/StockList.css'

const stockList = props => {
  const items = props.stocks.map( ( item ) => {
    return ( <StockItem key={item.id} stock={item}/> )
  } )
  return (
      <div className='stock-list'>
        { items }
      </div>
  )
}

export default stockList
