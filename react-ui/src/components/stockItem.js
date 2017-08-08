import React from 'react'
import '../styles/StockItem.css'

const stockItem = ( { stock } ) => {
  return (
    <div className='stock-item'>
      <h2 className='stock-item__title'>{ stock.t }</h2>
      <div className='stock-item__info'>
        <span><strong>Market:</strong> { stock.e }</span>
        <span><strong>Last price:</strong> { stock.l }</span>
        <span><strong>Last traded:</strong> { stock.lt }</span>
        <span><strong>Change:</strong> { stock.c }/{ stock.cp }%</span>
        <span></span>
      </div>
    </div>
  )
}

export default stockItem
