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

let morgan = require('morgan')
require('dotenv').config()
const cors = require('cors')
const app = express()
const origin = ['https://galaxy-media.netlify.app']
app.use(morgan('tiny'))

const port = process.env.PORT || 3001
const connectionString = process.env.DB_CONNECTION_STRING

app.use(cors(
  {
    origin:origin
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

 
app.listen(port,()=>{
    console.log("server running on port :" + port);
})


//socket.io

const io = require('socket.io')(8800, {
    cors: {
      origin: 'https://galaxy-media.netlify.app',
      // origin: 'http://localhost:3000'
      
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
  