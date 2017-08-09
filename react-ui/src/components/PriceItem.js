import React from 'react'
import moment from 'moment'
import '../styles/PriceItem.css'

const priceItem = ( props ) => {
  return (
    <div className='price-item'>
      <span className='price-item__price price-item__text'><strong>Price: </strong>{props.price}</span>
      <span className='price-item__date price-item__text'>{ moment( parseInt( props.date ) ).format( 'hh:mm:ssa ddd MM/DD/YYYY' ) }</span>
    </div>
  )
}

export default priceItem
