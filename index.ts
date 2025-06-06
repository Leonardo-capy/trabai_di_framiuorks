import mysql, { Connection, ConnectionOptions } from 'mysql2/promise';
import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors'; import path from 'path'
import fastifyStatic from '@fastify/static'

const site = fastify()
site.register(cors)

// Serve a pasta "public" como raiz de arquivos HTML/JS/CSS
site.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/', // acessa diretamente: http://localhost:8002/index.html
})





site.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send("Fastify FunFanDo")
})
site.get('/produto', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: 'trabalho_catalogo',
            port: 3306
        })
        const resultado = await conn.query("SELECT * FROM produto")
        const [dados, campoTabela] = resultado
        reply.status(200).send(dados)
    }
    catch (erro: any) {
        if (erro.code === 'ECONNREFUSED') {
            console.log("ERRO: O LARAGON ESTÁ LIGADO? POR FAVOR LIGUEO => Conexão Recusada")
            reply.status(400).send({ mensagem: "ERRO: LIGUE O LARAGAO => Conexão Recusada" })
        } else if (erro.code === 'ER_BAD_DB_ERROR') {
            console.log("ERRO: CRIE UM BANCO DE DADOS COM O NOME DEFINIDO NA CONEXÃO")
            reply.status(400).send({ mensagem: "ERRO: CRIE UM BANCO DE DADOS COM O NOME DEFINIDO NA CONEXÃO" })
        } else if (erro.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log("ERRO: CONFERIR O USUÁRIO E SENHA DEFINIDOS NA CONEXÃO")
            reply.status(400).send({ mensagem: "ERRO: CONFERIR O USUÁRIO E SENHA DEFINIDOS NA CONEXÃO" })
        } else if (erro.code === 'ER_NO_SUCH_TABLE') {
            console.log("ERRO: Você deve criar a tabela com o mesmo nome da sua QUERY")
            reply.status(400).send({ mensagem: "ERRO: Você deve criar a tabela com o mesmo nome da sua QUERY" })
        } else if (erro.code === 'ER_PARSE_ERROR') {
            console.log("ERRO: Você tem um erro de escrita em sua QUERY confira: VÍRGULAS, PARENTESES E NOME DE COLUNAS")
            reply.status(400).send({ mensagem: "ERRO: Você tem um erro de escrita em sua QUERY confira: VÍRGULAS, PARENTESES E NOME DE COLUNAS" })
        } else if (erro.code === 'ER_DUP_ENTRY') {
            console.log("ERRO: Seu ID esta duplicado mude-o")
            reply.status(400).send({ mensagem: "ERRO: Seu ID esta duplicado mude-o" })
        } else {
            console.log(erro)
            reply.status(400).send({ mensagem: "ERRO: NÃO IDENTIFICADO" })
        }
    }
})

site.post('/produto', async (request: FastifyRequest, reply: FastifyReply) => {
    const { nome, preco, vendedor } = request.body as any;
    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'trabalho_catalogo',
            port: 3306
        })
        const [result]: any = await conn.query(
            "INSERT INTO produto (nome, preco, vendedor) VALUES (?, ?, ?)",
            [nome, preco, vendedor]
        );
        const newId = result.insertId;

        reply.status(200).send({
            id: newId,
            nome,
            preco,
            vendedor
        });
        const [dados, camposTabela] = result
        reply.status(200).send(dados)
    }
    catch (erro: any) {
        if (erro.code === 'ECONNREFUSED') {
            console.log("ERRO: O LARAGON ESTÁ LIGADO? POR FAVOR LIGUEO => Conexão Recusada")
            reply.status(400).send({ mensagem: "ERRO: LIGUE O LARAGAO => Conexão Recusada" })
        } else if (erro.code === 'ER_BAD_DB_ERROR') {
            console.log("ERRO: CRIE UM BANCO DE DADOS COM O NOME DEFINIDO NA CONEXÃO")
            reply.status(400).send({ mensagem: "ERRO: CRIE UM BANCO DE DADOS COM O NOME DEFINIDO NA CONEXÃO" })
        } else if (erro.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log("ERRO: CONFERIR O USUÁRIO E SENHA DEFINIDOS NA CONEXÃO")
            reply.status(400).send({ mensagem: "ERRO: CONFERIR O USUÁRIO E SENHA DEFINIDOS NA CONEXÃO" })
        } else if (erro.code === 'ER_NO_SUCH_TABLE') {
            console.log("ERRO: Você deve criar a tabela com o mesmo nome da sua QUERY")
            reply.status(400).send({ mensagem: "ERRO: Você deve criar a tabela com o mesmo nome da sua QUERY" })
        } else if (erro.code === 'ER_PARSE_ERROR') {
            console.log("ERRO: Você tem um erro de escrita em sua QUERY confira: VÍRGULAS, PARENTESES E NOME DE COLUNAS")
            reply.status(400).send({ mensagem: "ERRO: Você tem um erro de escrita em sua QUERY confira: VÍRGULAS, PARENTESES E NOME DE COLUNAS" })
        } else if (erro.code === 'ER_DUP_ENTRY') {
            console.log("ERRO: Seu ID esta duplicado mude-o")
            reply.status(400).send({ mensagem: "ERRO: Seu ID esta duplicado mude-o" })
        } else {
            console.log(erro)
            reply.status(400).send({ mensagem: "ERRO: NÃO IDENTIFICADO" })
        }
    }
})

site.listen({ port: 8002 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})