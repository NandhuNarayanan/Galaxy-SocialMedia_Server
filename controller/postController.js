const { default: mongoose } = require('mongoose')
const postModel = require('../model/postModel')
const userModel = require('../model/userModel')
const reportModel = require('../model/reportModel')

exports.post = async (req, res) => {
  try {
    console.log(req.body)
    const { url, userId, caption } = req.body
    const createPost = new postModel({
      image: url,
      userId: userId,
      caption: caption,
    })
    createPost.save()
    res.status(200).json('Uploaded Successfully')
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}

exports.getPosts = async (req, res) => {
  try {
    const Posts = await postModel
      .find({ isDeleted: false })
      .populate('userId')
      .sort({ createdAt: -1 })
    res.status(200).json(Posts)
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}

exports.savedPost = async (req, res) => {
  try {
    const { SavedUserId, savePostId } = req.body
    console.log(SavedUserId)
    const findSave = await userModel.findOne({
      _id: SavedUserId,
      savedPost: savePostId,
    })
    if (findSave) {
      const unSave = await userModel.findByIdAndUpdate(
        { _id: SavedUserId },
        { $pull: { savedPost: savePostId } },
      )
      console.log(unSave, 'unlike')
      res.status(200).json({
        unSave,
      })
    } else {
      const savePost = await userModel.findByIdAndUpdate(
        { _id: SavedUserId },
        { $push: { savedPost: savePostId } },
      )
      console.log(savePost, 'save')
      res.status(200).json({ savePost })
    }
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}

exports.getUserPost = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.params.id)
    const userPosts = await postModel
      .find({ userId: userId, isDeleted: false })
      .populate('userId')
      .sort({ createdAt: -1 })
    res.status(200).json(userPosts)
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}

exports.getSavedPost = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.params.id)
    const savedPosts = await userModel
      .findOne({ _id: userId, isDeleted: false })
      .populate({
        path: 'savedPost',
        populate: {
          path: 'userId',
          model: 'users',
        },
      })
      .sort({ createdAt: -1 })
    console.log(savedPosts, 'savedPost')
    res.status(200).json(savedPosts)
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}

exports.deletePost = async (req, res) => {
  try {
    const deletePostId = mongoose.Types.ObjectId(req.body.postId)
    await postModel.findOneAndUpdate(
      { _id: deletePostId },
      { $set: { isDeleted: true } },
    )
    res.status(200).json('Post Deleted')
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}

exports.postNotification = async (req, res) => {
  try {
    const notificationContent = await userModel.find()
    res.status(200).json({ notificationContent })
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}

exports.userReport = async (req, res) => {
  try {
    console.log(req.body)
    const postId = mongoose.Types.ObjectId(req.body.postId)
    const reason = req.body.value
    const reportPost = await reportModel.findOne({ postId: postId })
    if (!reportPost) {
      const reasons = new reportModel({
        postId,
        reports: reason,
      })
      reasons.save()
      console.log(reasons, 'reassoooon')
    } else {
      const reportedPost = await reportModel.findOneAndUpdate(
        { postId: postId },
        { $push: { reports: reason } },
      )
      console.log(reportedPost, 'reportedPost')
    }
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}
