import http from 'http'
import path from 'path'
import fs from 'fs'
import socket from 'socket.io'
import nunjucks from 'nunjucks'
import axios from 'axios'
import finalHandler from 'finalhandler'

/** ******* Configs ***********/

const njk = new nunjucks.Environment( new nunjucks.FileSystemLoader( path.resolve( __dirname, '..', 'views' ) ), { autoescape: false } )
const PORT = 8080
const publicDir = path.join( process.cwd(), 'react-ui', 'build' ) // Public folder url to serve files from

/** ******* Handlers ***********/

const mainHandler = ( req, res ) => {
  const basepath = req.url.split( '/' )
  basepath.shift()

  switch ( basepath[0] ) {
    case '':
      return serveView( req, res )
    case 'static':
      return staticFileHandler( [...basepath], req, res )
    default:
      return finalHandler( req, res )( false )
  }
}

const serveView = ( req, res ) => {
  return axios.get( 'http://finance.google.com/finance/info?client=ig&q=AAPL,ABC,MSFT,TSLA,F' ).then( resp => {
    const finalResponse = njk.render( 'react-ui.njk', { stocks: resp.data } )
    res.writeHead( 200, { 'Content-Type': 'text/html' } )
    res.end( finalResponse )
  } ).catch( err => {
    res.writeHead( 500 )
    res.end( err )
  } )
}

const staticFileHandler = ( url, req, res ) => {
  const fileUrl = path.join( publicDir, ...url )
  const extension = path.extname( fileUrl )
  const contentTypes = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  }
  console.log( fileUrl )
  if ( fs.existsSync( fileUrl ) ) {
    console.log( 'EXISTS' )
    res.end( 'The file exists!' )
  } else {
    console.log( 'WHAT' )
    finalHandler( req, res )( false, 'File not found.' )
  }
}

const getStocks = ( req, res ) => {
  return axios.get( 'http://finance.google.com/finance/info?client=ig&q=AAPL,ABC,MSFT,TSLA,F' ).then( resp => {
    res.writeHead( 200, { 'Content-Type': 'application/json' } )
    res.end( resp.data )
  } )
}

/** ******* Server setup ***********/

const app = http.createServer( mainHandler )

const io = socket( app )

io.on( 'connection', socket => { console.log( 'SUCCESS' ) } )

app.listen( PORT, 'localhost' )

console.log( `Server running on port ${PORT}` )
