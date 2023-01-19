const mongoose = require('mongoose')


const reportSchema = mongoose.Schema(
    {
        reports: [{
            type: String,
          }],
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'posts',
          },
          isRemove: { type: Boolean, default: false },
},{timestamps:true}
);

const reportModel = mongoose.model('reports',reportSchema)
module.exports = reportModel