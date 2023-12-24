if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require('express')
const cors = require('cors')
const { createServer } = require('node:http')
const { Server } = require('socket.io');
const app = express()
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
})

const routes = require('./routes')
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(routes)

io.on('connection', (socket) => {
    console.log(socket, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
})

module.exports = { app, PORT }