const { default: mongoose } = require('mongoose');
const storyModel = require('../model/storyModel')



exports.uploadStory = (async(req,res)=> {
    console.log(req.body);
    try {
        const storyUrl = req.body.storyUrl
        const userId = mongoose.Types.ObjectId(req.body.userId)
        const createStory = new storyModel({
            storyImg:storyUrl,
            userId,
        })
         createStory.save()
         res.status(200).json('Stories Added')
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
})

exports.getStory = (async(req,res)=> {
    try {
        // var nextDate = new Date(new Date() - 24*60*60*1000);
        // const stories = await storyModel.find()
        // console.log(stories.createdAt > nextDate);
        // if (stories.createdAt > nextDate) { 
        // }
        const getStories = await storyModel.find().populate('userId')
        res.status(200).json({getStories})
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
})