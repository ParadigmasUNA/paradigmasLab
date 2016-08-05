//incluye un módulo de http
var http = require('http');

//Se crea un servidor web (web server)
http.createServer(function(req,res){
  //Responde a cualquier solicitu de http entrante
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');

//Muestra por consola que el servidor está corriendo en localhost puerto 1337
console.log('Server running at 127.0.0.1:1337');
