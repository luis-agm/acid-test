import React from 'react'
import '../styles/StockItem.css'
import { Link } from 'react-router-dom'
const stockItem = ( { stock, selectCurrent } ) => {
  const select = () => {
    return selectCurrent( stock.id )
  }
  return (
    <Link className='stock-item' to='/detail' onClick={select}>
      <h2 className='stock-item__title'>{ stock.t }</h2>
      <div className='stock-item__info'>
        <span><strong>Market:</strong> { stock.e }</span>
        <span><strong>Last price:</strong> { stock.l }</span>
        <span><strong>Last traded:</strong> { stock.lt }</span>
        <span><strong>Change:</strong> { stock.c }/{ stock.cp }%</span>
        <span></span>
      </div>
    </Link>
  )
}

export default stockItem
