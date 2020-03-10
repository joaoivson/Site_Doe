/* logica de fazer um café 

const cor = "Branco"
const tamanho = 2.5

function verificarSeOCopoEstaSujo (){
    // logica para verificar se o capa está sujo
    return 'o copo: $(sujo)'
}

const copo = {
    cor,
    tamanho,
    verificarSeOCopoEstaSujo,
}

console.log(copo.verificarSeOCopoEstaSujo(não esta sujo))
console.log(copo.verificarSeOCopoEstaSujo(esta sujo))
console.log(copo.verificarSeOCopoEstaSujo(não esta sujo))
console.log(copo.verificarSeOCopoEstaSujo(esta sujo))
*/

// Configurando o Servidor
const express = require("express")
const server = express()

// Configurar Servidor para apresentar arquivos Esaticos (extras)
server.use(express.static('public'))

// Habilitar Body do Formulario
server.use(express.urlencoded({ extended: true}))

// Configurar conexão com o Banco de Dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'kapilca2804',
    host: 'localhost',
    port: 5432,
    database: 'doe',
})

//Configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true, //boolean ou booleano
})   

// AGRUPAMENTO DE DADOS ([Vetor ou [array] )

/*const donors = [
    {
        name: "João Ivson",
        blood: "AB+"
    },
    {
        name: "Samuel Lima",
        blood: "A+"
    },
    {
        name: "Rubenita Lima",
        blood: "O+"
    },
    {
        name: "Maria Izabel",
        blood: "AB+"
    },
]
*/


// Configurar a apresentação da Pagina
server.get("/", function(req, res){
    
    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("Erro de Banco de Dados")
        
        const donors = result.rows;
        return res.render("index.html", { donors })
    })

   
})


// Pegar dados do formulario
server.post("/", function(req, res) {
    
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    
    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

//Coloco valores dentro do Banco de Dados.

const query = 
        `INSERT INTO donors ("name", "email", "blood")
         VALUES ($1, $2, $3)`

const values = [name, email, blood]

db.query(query, values, function(err){
    // Fluxo de Errio
    if (err) return res.send("Erro no Banco de Dados")
    
    //Fluxo Ideal
    return res.redirect("/")
    })
})

//Ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function(){
    console.log("Iniciei o servidor.")
})