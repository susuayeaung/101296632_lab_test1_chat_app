const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const PORT = 3000

const userRouter = require('./routes/UserRoutes')
const groupMessageRouter = require('./routes/GroupMessageRoutes')
const privateMessageRouter = require('./routes/PrivateMessageRoutes')

//Create Server Side socket
var app = express();
var http = require('http').createServer(app)
var io = require('socket.io')(http, {cors: {origin: "*"}})

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '/')))

var dbUrl = 'mongodb+srv://susuayeaung:QsredeVuRQnwuj7R@cluster0.0bylp.mongodb.net/labtest1_comp3133?retryWrites=true&w=majority'

mongoose.connect(dbUrl, {
   useNewUrlParser: true,
   useUnifiedTopology: true
 }).then(success => {
   console.log('Success Mongodb connection')
 }).catch(err => {
   console.log('Error Mongodb connection: ' + err)
 });

 app.use(userRouter)
 app.use(groupMessageRouter)
 app.use(privateMessageRouter)

//Default Express GET
app.get("/", (req, res) => {
    res.send("<h1>Welcome to the Chat App</h1>")
})

//Get index.html
app.get("/index.html", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

var Message = mongoose.model('Message', {
    username: String,
    message: String,
    room: String
})

 app.get("/messages", (req, res) => {
     Message.find({}, (err, messages) => {
         res.send(messages);
     })
 })

app.post("/messages", (req, res) => {
    var message = new message(req.body);
    message.save((err) => {
        if(err){
            console.log(err)
        }
        res.sendStatus(200);
    })
})

const users = [];


//Accept client request
io.on('toConnect', (socket) => {
    console.log(`${socket.id} is joined to the chat.`)

    //Send welcome message
    socket.emit("toConnect", ({ username: '', message: `Welcome`}))
    socket.broadcast.emit('joinRoom', ({username: `${users[0]}`, message: ''}))

    //New message from client
    socket.on('user', ({username, room, message}) => {
        users.push(username)
        socket.join(room)
        socket.broadcast.to(room).emit('joinRoom', ({username, room, message}))
        socket.emit("joinRoom", ({username, room, message}))
    })

    //Disconnected
    socket.on('disconnect', () => {
        io.emit("connect", ({ username: '', message: `User is diconnected`}))
    })
})

//Start HTTP server
http.listen(PORT, () => {
    console.log('Server running at PORT', http.address().port)
})
