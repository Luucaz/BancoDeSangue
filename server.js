//Configurando o servidor
const express = require("express")
const server = express()

//Configurar o servidor para aprensentar arquivos extras, extras...
server.use(express.static('public'))

//Habilitar corpo do formulario
server.use(express.urlencoded({ extended: true}))

//Configurar conexão com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'dj@ngolibr3',
    host: 'localhost',
    port: 5432,
    database: 'Doe',

})

//Configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})


//Configurar a apresentação da página
server.get("/", function(req, res) {
    db.query("SELECT * FROM donors", function(err, result) {
        if(err) return res.send("Erro de banco de dados.")

        const donors = result.rows;
        return res.render("index.html", { donors })
    })


})

server.post("/", function(req, res){
    //Pegar valores do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return  res.send("Todos os campos são obrigatórios.")
    }

    //Colocando valores para o banco de dados
    const query = `
    INSERT INTO donors ("name", "email", "blood")
    Values ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err) {
        //fluxo de erro
        if (err) return res.send("erro no banco de dados.")
        //fluxo ideal
        return res.redirect("/")
    })


})

//ligar o servidor e permitir acesso na porta 3000
server.listen(3000, function(){
    console.log("iniciei o servidor")
})