const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
var https = require("https");
var path = require("path");
const url = require('url');
//const tabula = require('fresh-tabula-js');

var spawn = require('child_process').spawn;

const app = express();

//#region Download

var file_url = 'http://www.ans.gov.br/images/stories/Plano_de_saude_e_Operadoras/tiss/Padrao_tiss/tiss3/padrao_tiss_componente_organizacional_201902.pdf';
var DOWNLOAD_DIR = './tmp/';

var file_name = url.parse(file_url).pathname.split('/').pop();

var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);

var curl = spawn('curl', [file_url]);

curl.stdout.on('data', function(data) { file.write(data); });

curl.stdout.on('end', function(data) {
    file.end();
    console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
});

curl.on('exit', function(code) {
    if (code != 0) {
        console.log('Failed: ' + code);
    }
});

//#endregion

//#region  conexão BD
const con = mysql.createConnection({
  host: 'localhost',
  user: 'SA',
  password: '123456',
  database: 'test'
});

con.connect((err) => {
  if(err){
    console.log('Erro conectando ao Banco de Dados');
    return;
  }
  console.log('Conexão estabelecida');
});

con.query('SELECT * FROM categoriapadraotiss', (err, rows) => {
  if(err) throw err;

  console.log('Dados recebidos do BD: \n');
  console.log(rows);
});

con.end((err) => {

});
//#endregion

//#region PDF

const tabula = require('tabula-js');
const stream = tabula('./tmp/padrao_tiss_componente_organizacional_201902.pdf', { pages: '90-95' }).streamCsv();
stream.pipe(process.stdout);

  

//'./tmp/padrao_tiss_componente_organizacional_201902.pdf', { pages: '90-95' }
//#endregion

app.use(express.json());
app.use(require('./routes'));
app.listen(3333);