import http from 'http'
import path from 'path'
import fs from 'fs'
import moment from 'moment-timezone'
import morgan from 'morgan'
import socket from 'socket.io'
// import nunjucks from 'nunjucks'
import axios from 'axios'
import finalHandler from 'finalhandler'
import _ from 'lodash'

/** ******* Configs ***********/

// const njk = new nunjucks.Environment( new nunjucks.FileSystemLoader( path.resolve( __dirname, '..', 'views' ) ), { autoescape: false } )
const PORT = 8080
const publicDir = path.join( process.cwd(), 'react-ui', 'build' ) // Public folder url to serve files from
const logger = morgan( 'dev' )

/** ******* Request Handlers ***********/

const mainHandler = ( req, res ) => {
  console.log( 'wat' )
  return logger( req, res, ( err ) => {
    if ( err ) return finalHandler( req, res )( err )
    return serverRouter( req, res )
  } )
}

const serverRouter = ( req, res ) => {
  const basepath = req.url.split( '/' )
  basepath.shift()

  switch ( basepath[0] ) {
    case '':
      return serveView( req, res )
    case 'favicon.ico':
    case 'service-worker.js':
    case 'static':
      return staticFileHandler( [...basepath], req, res )
    default:
      return finalHandler( req, res )( false )
  }
}

const serveView = ( req, res ) => {
  // const finalResponse = njk.render( 'react-ui.njk', { stocks: resp.data } )
  res.writeHead( 200, { 'Content-Type': 'text/html' } )
  fs.createReadStream( path.join( publicDir, 'index.html' ) ).pipe( res )
}

const staticFileHandler = ( url, req, res ) => {
  const fileUrl = path.join( publicDir, ...url )
  const extension = path.extname( fileUrl )
  const contentTypes = {
    '.map': 'application/octet-stream',
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  }
  if ( fs.existsSync( fileUrl ) ) {
    res.writeHead( 200, { 'Content-Type': contentTypes[extension] } )
    fs.createReadStream( fileUrl ).pipe( res )
  } else {
    finalHandler( req, res )( false )
  }
}

/** ******* Helpers ***********/

const getStocks = () => {
  return axios.get( 'http://finance.google.com/finance/info?client=ig&q=AAPL,ABC,MSFT,TSLA,F' )
    .then( resp => {
      // 'Math.rand' does not exist and 'Math.random' doesn't take any arguments, 0 and 1 is default range.
      if ( Math.random() < 0.1 ) throw new Error( 'How unfortunate! The API Request Failed' )
      const objectResponse = resp.data.substr( 3 ) // remove weird double slash in response
      return JSON.parse( objectResponse )
    } )
    .catch( err => {
      if ( err.message === 'How unfortunate! The API Request Failed' ) return getStocks()
      return err
    } )
}

/** ******* Server setup ***********/

const app = http.createServer( mainHandler )
app.listen( PORT, 'localhost' )

console.log( `Server running on port ${PORT}` )

/** ******* Socket.io Stuff ***********/

const io = socket( app )

// This are closing and opening hours for both NASDAQ and NYSE
const marketCloses = moment.tz( 'America/New_York' ).hours( 16 ).minutes( 0 ).seconds( 0 ).format()
const marketOpens = moment.tz( 'America/New_York' ).hours( 9 ).minutes( 30 ).seconds( 0 ).format()

const isMarketClosed = ( time ) => {
  return time.isAfter( marketCloses ) || time.isBefore( marketOpens )
}

const getAndSend = async ( socket ) => {
  const newStocks = await getStocks()
  if ( newStocks instanceof Error ) {
    io.emit( 'APIerror' )
    console.log( 'emitted error', newStocks )
  } else if ( socket ) {
    socket.emit( 'firstResults', newStocks )
    console.log( 'emitted first results' )
  } else {
    io.emit( 'newResults', newStocks )
    console.log( 'emitted results' )
  }
}

io.on( 'connect', async ( socket ) => {
  console.log( 'New connection: ', socket.id )
  if ( isMarketClosed( moment() ) ) {
    socket.emit( 'marketClosed' )
  }
  getAndSend( socket )
} )

setInterval( () => {
  if ( !isMarketClosed( moment().hours( 12 ) ) ) { // Wait till market opens
    io.clients( async ( err, clients ) => {
      if ( !err ) {
        if ( clients.length > 0 ) { // Don't make the call and event if nobody is listening
          getAndSend()
        }
      } else {
        throw new Error( err )
      }
    } )
  }
}, 5000 )
