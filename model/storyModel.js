const mongoose = require('mongoose')


const storySchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'users',
          },
        storyImg:[{}],
        textStory: String,

},{timestamps:true}
);

const storyModel = mongoose.model('storys',storySchema)
module.exports = storyModel