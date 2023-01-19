const { default: mongoose } = require('mongoose')
const postModel = require('../model/postModel')
const reportModel = require('../model/reportModel')
const userModel = require('../model/userModel')
const adminModel = require('../model/adminModel')
const token = require('../utils/Token')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler')



exports.adminlogin = async (req, res) => {
  console.log(req.body,'req.bodyreq.bodyreq.bodyreq.body');
  
  const email = req.body.email
  const password = req.body.password

  try {
    if (!email || !password) return res.status(400).json({ message: 'all fields required' })
    const admin = await adminModel.findOne({ email })
    console.log(admin,'0987654321');
    if (!admin) return res.status(401).json({ message: 'invalid user' })
    const result = await bcrypt.compare(password, admin.password)
    if (!result) return res.status(401).json({ message: 'invalid password' })
    const accessToken = token.createAccessToken(admin._id)
    const refreshToken = token.createRefreshToken(admin._id)
    await adminModel.findByIdAndUpdate(admin._id, { $push: { refreshToken } })
    res.status(200).json({ refreshToken, accessToken })
  } catch (error) {
    res.status(500).json({
      message: error,
    })
    console.log(error)
  }
}

exports.refresh = asyncHandler(async (req, res) => {
  const cookie = req.headers.refresh
  if (!cookie) return res.status(401).json({ message: 'Unauthorized' })
  const refreshToken = cookie.split(' ')[1]
  const foundUser = await adminModel
    .findOne({ refreshToken: refreshToken })
    .exec()
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      asyncHandler(async (error, decoded) => {
        if (error) {
          console.log(error)
          return res.status(403)
        }
        const hacked = await adminModel.findById(decoded.user).exec()
        hacked.refreshToken = []
        await hacked.save()
        return res.status(403).json({ message: 'forbidden' })
      }),
    )
    return foundUser
  }
  const newArray = foundUser.refreshToken.filter((e) => e !== refreshToken)
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (error, decoded) => {
      if (error) {
        foundUser.refreshToken = newArray
        await foundUser.save()
        return res.status(403).json({ message: 'forbidden' })
      }
      const newRefreshToken = token.createRefreshToken(foundUser._id)

      const accessToken = token.createAccessToken(foundUser._id)
      foundUser.refreshToken = [...newArray, newRefreshToken]
      await foundUser.save()
      res.json({ refreshToken: newRefreshToken, accessToken })
    }),
  )
})






exports.getUsers = async (req, res) => {
  try {
    const allUsers = await userModel.find()
    res.status(200).json({ allUsers })
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}

exports.reportPost = async (req, res) => {
  try {
    const reportedPosts = await reportModel.find({isRemove: false}).populate({
      path: 'postId',
      populate: {
        path: 'userId',
        model: 'users',
      },
    })
    res.status(200).json({ reportedPosts })
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}

exports.removePost = async (req, res) => {
  try {
    const reportPostId = mongoose.Types.ObjectId(req.body.postId)
    await postModel.findOneAndUpdate(
      { _id: reportPostId },
      { $set: { isDeleted: true } },
    )
    await reportModel.findOneAndUpdate(
      { postId: reportPostId },
      { $set: { isRemove: true } },
    )
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}

exports.declinePost = async (req, res) => {
    try {
      const declineReport = mongoose.Types.ObjectId(req.body.postId)
      
      await reportModel.findOneAndDelete(
        { postId: declineReport }
      )
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
  }


  exports.blockUser = async (req, res) => {
    try {
        console.log(req.body,'huuuuuhaaaaaaahaaaaaa');
      const blockedUserId = mongoose.Types.ObjectId(req.body.userId)
   const blockedUser =  await userModel.findOneAndUpdate(
        { _id: blockedUserId },
        { $set: { isBlocked: true } },
      )
      res.status(200).json({blockedUser})
    } catch (error) {
      res.status(500).json(error)
      console.log(error)
    }
  }