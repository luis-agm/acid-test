import React, { Component } from 'react'
import PriceItem from '../components/PriceItem'
import '../styles/PriceList.css'

class priceList extends Component {
  shouldComponentUpdate ( newProps ) {
    return this.props !== newProps
  }
  render ( ) {
    const prices = this.props.prices.map( ( item ) => {
      return ( <PriceItem key={item.date} price={item.price} date={item.date}/> )
    } )
    return (
    <div className='price-list'>
      <h2>{ this.props.stock.t }</h2>
      <div className='price-list__content'>
        { prices }
      </div>
    </div>
    )
  }
}

export default priceList
