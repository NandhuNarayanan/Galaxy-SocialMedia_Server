const mongoose = require('mongoose')

const commentSchema = mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'posts',
    },

    comments: [
      {
        content: String,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
        },
        date: {
          type: Date,
          default: new Date(),
        },
        replies: [
          {
            content: String,
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'users',
            },
            date: { type: Date, default: new Date() },
          },
        ],
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
        isDeleted: { type: Boolean, default: false },
      },
    ],
  },

  { timestamps: true },
)

const commentModel = mongoose.model('comments', commentSchema)

module.exports = commentModel
