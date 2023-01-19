const messageModel = require('../model/messageModel')

exports.addMessage = async (req, res) => {
  try {
    const { chatId, senderId, text } = req.body
    const message = new messageModel({
      chatId,
      senderId,
      text,
    })
    const result = await message.save()
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}


exports.getMessages = (async(req,res)=>{
  try {
    const {chatId} = req.params;
    const result = await messageModel.find({_id:chatId});
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
})