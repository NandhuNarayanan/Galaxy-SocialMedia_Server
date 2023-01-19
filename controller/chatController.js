const chatModel = require('../model/chatModel')


exports.createChat = (async(req,res)=>{
    try {
        const newChat = new chatModel({
            members: [req.body.senderId,req.body.receiverId],
        });

        const result = await newChat.save();
        res.status(200).json(result);
        
    } catch (error) {
        res.status(500).json(error)
        console.log(error);
    }
})


exports.userChats = (async(req,res)=>{
    try {
        const chat = await chatModel.find({
            members:{$in:[req.params.userId]}
        })
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error)
        console.log(error);
    }
});


exports.findChat = (async(req,res)=>{
    try {
        const chat = await chatModel.findOne({
            members:{$all:[req.params.firstId,req.params.secondId]} 
        })
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error)
        console.log(error);
    }
})