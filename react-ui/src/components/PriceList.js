import React from 'react'
import PriceItem from '../components/PriceItem'
import '../styles/PriceList.css'

const priceList = ( props ) => {
  const prices = props.prices.map( ( item ) => {
    return ( <PriceItem key={item.date} price={item.price} date={item.date}/> )
  } )
  return (
    <div className='price-list'>
      <h2>{ props.stock.t }</h2>
      <div className='price-list__content'>
        { prices }
      </div>
    </div>
  )
}

export default priceList
