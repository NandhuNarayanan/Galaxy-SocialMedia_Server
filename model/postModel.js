const mongoose = require('mongoose')

const postSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'users',
    },
    caption: String,
    image: [{}],
    
    // likedUsers: [{ type: mongoose.Schema.Types.ObjectId,ref:'users' }],
    likedUsers:[],
    isDeleted: { type: Boolean, default: false },
    hiddenUsers: [{ type: mongoose.Types.ObjectId }],
    isLiked:{type:Boolean, default:false},
   
  // isSaved:{type:Boolean, default:false},
  },
  { timestamps: true },
)

const postModel = mongoose.model('posts', postSchema)

module.exports = postModel
