import React from 'react'
import { ConnectedRouter } from 'react-router-redux'
import { Route } from 'react-router-dom'
import { history } from '../redux/configureStore'

import Home from '../containers/Home'
import StockHistory from '../containers/StockHistory'
import Header from '../components/header'

console.log( 'WAT', ConnectedRouter )

export default class App extends React.Component {
  render () {
    return (
      <ConnectedRouter history={history}>
          <div>
              <Header />
              <div className="container">
                  <Route exact path="/" component={ Home }/>
                  <Route path="/detail" component={ StockHistory }/>
              </div>
          </div>
      </ConnectedRouter>
    )
  }
}
