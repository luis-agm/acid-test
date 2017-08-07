import React from 'react'
import '../styles/StockItem.css'

const stockItem = ( { stock } ) => {
  return (
    <div className='stock-item'>
      <h2 className='stock-item__title'>{ stock.t }</h2>
      <div className='stock-item__info'>
        <span>Last price: { stock.l }</span>
        <span>Last traded: { stock.lt }</span>
        <span>Change: { stock.c }/{ stock.cp }%</span>
        <span></span>
      </div>
    </div>
  )
}

export default stockItem
