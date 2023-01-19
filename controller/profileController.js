const { default: mongoose } = require('mongoose')
const userModel = require('../model/userModel')

exports.profile = async (req, res) => {
  try {
    const userId = req.params.id
    const profile = await userModel
      .findById({ _id: userId })
      .select('-password')
      .select('-refreshToken')
    res.status(200).json(profile)
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}

exports.follow = async (req, res) => {
  try {
    console.log(req.body);
    const { followUserId, user } = req.body
    const userId = mongoose.Types.ObjectId(user)
    const profileUserId = mongoose.Types.ObjectId(followUserId)

    const foundFollowedUser = await userModel.findOne({
      $and: [{ _id: userId }, { following: { $in: [profileUserId] } }],
    })

    if (foundFollowedUser) {
      const unfollow = await userModel.findByIdAndUpdate(
        { _id: userId },
        { $pull: { following: profileUserId } },
      )
      const removeUser = await userModel.findByIdAndUpdate(
        { _id: profileUserId },
        { $pull: { followers: userId } },
      )
      return res.status(200).json({ message: 'unfollow successfull' })
    }
    const followingUser = await userModel.findByIdAndUpdate(
      { _id: userId },
      { $push: { following: [profileUserId] } },
    )
    const followersUser = await userModel.findByIdAndUpdate(
      { _id: profileUserId },
      { $push: { followers: [userId] } },
    )
    res
      .status(201)
      .json({ followersUser, followingUser, message: 'follow successfully' })
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}

exports.profilePicture = async (req, res) => {
  try {
    const { user, url } = req.body
    const Picture = await userModel.findOne({ _id: user })
    const profileUpdate = await userModel.findByIdAndUpdate(
      Picture,
      {
        $set: { profilePicture: url },
      },
      { new: true },
    )
    res
      .status(201)
      .json({ profileUpdate, message: 'profile updated successfull' })
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}

exports.editProfile = async (req, res) => {
  try {
    console.log(req.body, 'profile')
    const { user, fname, bio, location, gender } = req.body
    const info = await userModel.findOne({ _id: user })
    if (info) {
      const userinfo = await userModel.findByIdAndUpdate(user, {
        $set: {
          firstName: fname,
          bio: bio,
          location: location,
          gender: gender,
        },
      })
      res
        .status(200)
        .json({ userinfo, message: 'user info updated successfull' })
    }
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}

exports.userList = async (req, res) => {
  try {
    const user = mongoose.Types.ObjectId(req.params.id)
    const followingList = await userModel.find({ followers: user })
    const followersList = await userModel.find({following:user})
    res.json({followersList,followingList})
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}


exports.searchUser = async (req, res) => {
  try {
    console.log(req.body);
    if(req.body.search === ''){
      console.log('asfdf');
    }
    else{
      const searchUsers =  await userModel.find({
        firstName: {$regex: new RegExp(req.body.search),$options:"si"},
      });
      res.status(200).json(searchUsers)
    }
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}
