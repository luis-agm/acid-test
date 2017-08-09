import React, { Component } from 'react'
import moment from 'moment'
import isEqual from 'lodash/isEqual'
import '../styles/PriceItem.css'

class priceItem extends Component {
  shouldComponentUpdate ( newProps ) {
    return !isEqual( this.props, newProps )
  }
  render () {
    return (
    <div className='price-item'>
      <span className='price-item__price price-item__text'><strong>Price: </strong>{this.props.price}</span>
      <span className='price-item__date price-item__text'>{ moment( parseInt( this.props.date ) ).format( 'hh:mm:ssa ddd MM/DD/YYYY' ) }</span>
    </div>
    )
  }
}

export default priceItem
