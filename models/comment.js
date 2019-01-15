var mongoose    = require('mongoose'),
    commentSchema = mongoose.Schema({
        text: String,
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            username: String
        }
    });

module.exports = mongoose.model('Comment', commentSchema);
