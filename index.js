const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authRouter = require('./routes/auth.js')
const postRouter = require('./routes/post')
const profileRouter = require('./routes/profile')
const chatRouter = require('./routes/chat')
const messageRouter = require('./routes/message')
const storyRouter = require('./routes/story')
const adminRouter = require('./routes/admin')
const cors = require('cors')


const {createServer}=require('http');
const {Server} = require('socket.io')


let morgan = require('morgan')
require('dotenv').config()
const app = express()
const origin = [`${process.env.CLIENT_URL}`]
app.use(morgan('tiny'))

const port = process.env.PORT || 3001
const connectionString = process.env.DB_CONNECTION_STRING

app.use(cors(
  {
    origin:origin,
    credentials:true,
    optionsSuccessStatus:200
  }
))
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))



//Port

mongoose.connect(connectionString).then(()=>{
    console.log("db connected");
}).catch((err)=>{
    console.log(err.message);
})

//usage of routes
app.use('/',authRouter)
app.use('/post',postRouter)
app.use('/profile',profileRouter)
app.use('/chat',chatRouter)
app.use('/message',messageRouter)
app.use('/story',storyRouter)
app.use('/admin',adminRouter)

 



//socket.io

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
      origin: `${process.env.CLIENT_URL}`,
      
    },
  })
  
  let activeUsers = []
  
  io.on('connection', (socket) => {
    //add new User
    socket.on('new-user-add', (newUserId) => {
      //if user is not added previously
      if (!activeUsers.some((user) => user.userId === newUserId)) {
        activeUsers.push({
          userId: newUserId,
          socketId: socket.id,
        })
      }
      console.log('Connected Users', activeUsers)
      io.emit('get-users', activeUsers)
    })
  
    //send message
    socket.on('send-message', (data) => {
      const { receiverId } = data
      const user = activeUsers.find((user) => user.userId === receiverId)
      console.log('Sending from socket to : ', receiverId);
      console.log('Data',data);
      if (user) {
        io.to(user.socketId).emit("receive-message",data)
      }
    })
  
    socket.on('disconnect', () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
      console.log('User Disconnected', activeUsers)
      io.emit('get-users', activeUsers)
    })
  })
  
  httpServer.listen(port,()=>{
    console.log("server running on port :" + port);
})