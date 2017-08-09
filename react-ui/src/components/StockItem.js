import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import isEqual from 'lodash/isEqual'
import { Link } from 'react-router-dom'
import '../styles/StockItem.css'

class stockItem extends Component {
  shouldComponentUpdate ( newProps ) {
    return !isEqual( this.props, newProps )
  }
  componentWillUpdate () {
    ReactDOM.findDOMNode( this ).classList.add( 'updated' )
  }
  componentDidUpdate () {
    const el = ReactDOM.findDOMNode( this )
    setTimeout( function removeClass () {
      el.classList.remove( 'updated' )
    }, 500 )
  }
  render () {
    const select = () => {
      return this.props.selectCurrent( this.props.stock.id )
    }
    return (
    <Link className='stock-item' to='/detail' onClick={select}>
      <h2 className='stock-item__title'>{this.props.stock.t}</h2>
      <div className='stock-item__info'>
        <span><strong>Last price: ${this.props.stock.l}</strong></span>
        <span><strong>Change:</strong> {this.props.stock.c}/{this.props.stock.cp}%</span>
        <span><strong>Last traded:</strong> {this.props.stock.lt}</span>
        <span><strong>Market:</strong> {this.props.stock.e}</span>
        <span></span>
      </div>
    </Link>
    )
  }
}

export default stockItem
