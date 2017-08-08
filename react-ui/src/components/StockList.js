import React from 'react'
import StockItem from './StockItem'
import '../styles/StockList.css'

const stockList = props => {
  const items = props.stocks.map( ( item ) => {
    return ( <StockItem key={item.id} stock={item} selectCurrent={props.selectStock}/> )
  } )
  return (
      <div className='stock-list'>
        { items }
      </div>
  )
}

export default stockList
