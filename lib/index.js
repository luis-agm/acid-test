import http from 'http'
import path from 'path'
import fs from 'fs'
import morgan from 'morgan'
import socket from 'socket.io'
// import nunjucks from 'nunjucks'
import axios from 'axios'
import finalHandler from 'finalhandler'

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
  return axios.get( 'http://finance.google.com/finance/info?client=ig&q=AAPL,ABC,MSFT,TSLA,F' ).then( resp => {
    const objectResponse = resp.data.substr( 3 )
    return JSON.parse( objectResponse )
  } )
}

/** ******* Server setup ***********/

const app = http.createServer( mainHandler )
app.listen( PORT, 'localhost' )

console.log( `Server running on port ${PORT}` )

/** ******* Socket.io Stuff ***********/

const io = socket( app )

io.on( 'connect', socket => {
  console.log( 'wooooot', socket.id )
  socket.on( 'getStocks', async () => { // REMOVE ASYNC AFTER TEST
    const newStocks = await getStocks()
    socket.emit( 'newResults', newStocks )
    // setInterval( async () => {
    //   const newStocks = await getStocks()
    //   socket.emit( 'newResults', newStocks )
    // }, 5000 )
  } )
} )
