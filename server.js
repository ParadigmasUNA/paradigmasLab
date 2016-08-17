let express = require('express'); //importar modulo de express
let path = require('path'); //importar modulo de path
let app = express();

app.use(express.static(__dirname + '/Web'));
//Se puede filtrar los get con expresiones regulares
app.get('/',(request,response) => response.sendFile('index.html',{root:path.join(__dirname,'./Web')}));
app.listen(1333,() => console.log("Server is running on port 1333"));



