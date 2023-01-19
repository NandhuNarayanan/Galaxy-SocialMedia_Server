const userModel = require('../model/userModel')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const jwt = require('../utils/Token')
const asyncHandler = require('express-async-handler')
const { default: mongoose } = require('mongoose')

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body.values

  try {
    const oldUser = await userModel.findOne({ email })
    if (oldUser) return res.json({ message: 'user already exist' })
    if (!email || !password || !firstName || !lastName || !phone)
      return res.json({ message: 'all field required' })
    const hash = await bcrypt.hash(password, 10)
    const newUser = new userModel({
      email,
      password: hash,
      phone,
      firstName,
      lastName,
    })
    await newUser.save()
    const accessToken = jwt.createAccessToken(newUser._id)
    const refreshToken = jwt.createRefreshToken(newUser._id)

    await userModel.findByIdAndUpdate(newUser._id, { $push: { refreshToken } })

    res.status(201).json({ accessToken, refreshToken, newUser })
  } catch (error) {
    res.status(500).json({
      message: error,
    })
    console.log(error)
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password)
      return res.status(400).json({ message: 'all fields required' })
    const newUser = await userModel.findOne({ email })
    if (!newUser) return res.status(401).json({ message: 'invalid user' })
    const result = await bcrypt.compare(password, newUser.password)
    if (!result) return res.status(401).json({ message: 'invalid password' })
    const accessToken = jwt.createAccessToken(newUser._id)
    const refreshToken = jwt.createRefreshToken(newUser._id)
    await userModel.findByIdAndUpdate(newUser._id, { $push: { refreshToken } })
    res.status(200).json({ refreshToken, accessToken, newUser })
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
  const foundUser = await userModel
    .findOne({ refreshToken: refreshToken })
    .exec()
  if (!foundUser) {
    JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      asyncHandler(async (error, decoded) => {
        if (error) {
          console.log(error)
          return res.status(403)
        }
        const hacked = await userModel.findById(decoded.user).exec()
        hacked.refreshToken = []
        await hacked.save()
        return res.status(403).json({ message: 'forbidden' })
      }),
    )
    return foundUser
  }
  const newArray = foundUser.refreshToken.filter((e) => e !== refreshToken)
  JWT.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (error, decoded) => {
      if (error) {
        foundUser.refreshToken = newArray
        await foundUser.save()
        return res.status(403).json({ message: 'forbidden' })
      }
      const newRefreshToken = jwt.createRefreshToken(foundUser._id)

      const accessToken = jwt.createAccessToken(foundUser._id)
      foundUser.refreshToken = [...newArray, newRefreshToken]
      await foundUser.save()
      res.json({ refreshToken: newRefreshToken, accessToken })
    }),
  )
})

exports.logout = async (req, res) => {
  try {
    console.log(req.params);
    const user = mongoose.Types.ObjectId(req.params.id)
      const refreshToken = req.headers.authorization
      if (!refreshToken) return res.status(400).json({ message: 'refreshToken missing' })
      await userModel.findByIdAndUpdate({_id:user}, { $pull:  [refreshToken]  })
      res.status(200).json({ message: 'logout successfull' })
  } catch (error) {
    
  }
}

exports.getUsers = async (req, res) => {
  try {
    const user = mongoose.Types.ObjectId(req.params.id)
    const newUser = await userModel.findOne({ _id: user })
    res.status(200).json({ newUser })
  } catch (error) {
    res.status(500).json({
      message: error,
    })
    console.log(error)
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    console.log(req.params)
    const loginUser = mongoose.Types.ObjectId(req.params.id)
    console.log(loginUser, 'lohin')
    const suggetionUser = await userModel.find({
      $and: [{ _id: { $ne: loginUser } }, { followers: { $nin: [loginUser] } }],
    })
    res.status(200).json(suggetionUser)
  } catch (error) {
    res.status(500).json({
      message: error,
    })
    console.log(error)
  }
}


// login with google
exports.googleLogin = asyncHandler(async (req, res) => {
  console.log(req.body,'goooogleeeeee');
  const credential = req.body.userObject
  const { email, given_name, family_name } = credential
  const newUser = await userModel.findOne({ email }).exec()
  if (newUser) {
      const accessToken = jwt.createAccessToken(newUser._id)
      const refreshToken = jwt.createRefreshToken(newUser._id)
      newUser.refreshToken = [...newUser.refreshToken, refreshToken]
      await newUser.save();
      res.cookie('JWT', refreshToken, {
          // httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 7 * 24 * 60 * 60 * 1000
      })

      return res.status(200).json({ accessToken , newUser})
  } else {
      const newUser = new userModel({ email, firstName:given_name, lastName:family_name })
      const accessToken = jwt.createAccessToken(newUser._id)
      const refreshToken = jwt.createRefreshToken(newUser._id)
      await newUser.save()
      res.cookie('JWT', refreshToken, {
          // httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 7 * 24 * 60 * 60 * 1000
      })

      return res.status(200).json({ accessToken,newUser })

  }
})