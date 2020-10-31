const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const session = require("express-session")
const connectSession=require("connect-session-knex")(session)
const usersrouter = require("./users/usersRouter")
const database=require("./database/config")

const server = express()
const port =4000


server.use(helmet())
server.use(cors())
server.use(express.json())
server.use(session({
    resave: false, 
	saveUninitialized: false, 
	secret: "keep it secret, keep it safe", 
    store: new connectSession({
    knex: database,
    createtable: true,
})
}))
server.use(usersrouter)

server.use((err, req, res, next) => {
	console.log(err)
	
	res.status(500).json({
		message: "Something went wrong",
	})
})

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`)
})