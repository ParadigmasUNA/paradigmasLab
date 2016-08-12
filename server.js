let express = require('express'); //importar modulo de express
let path = require('path'); //importar modulo de path
let app = express();

app.use('/scripts', express.static(__dirname + '/Web/js')); //Para que pueda leer las rutas de los scripts
app.use('/cssFiles', express.static(__dirname + '/Web/css')); //Para que pueda leer las rutas de los stilos
//Se puede filtrar los get con expresiones regulares
app.get('/',(request,response) => response.sendFile('index.html',{root:path.join(__dirname,'./Web')}));
app.listen(1333,() => console.log("Server is running on port 1333"));
