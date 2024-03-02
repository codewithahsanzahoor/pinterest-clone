const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect('mongodb://127.0.0.1:27017/learn-what-matters', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

const PostSchema = new Schema({
	imageText: {
		type: String,
		required: true,
	},
	image: {
		type: String,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	likes: {
		type: Array,
		default: [],
	},
})

module.exports = mongoose.model('posts', PostSchema)
