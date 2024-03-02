const mongoose = require('mongoose')
const Schema = mongoose.Schema
const plm = require('passport-local-mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/learn-what-matters', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
	},
	// This code snippet defines a field in a schema that stores an array of ObjectIds referencing posts from another collection named 'posts'.
	posts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'posts',
		},
	],
	dp: {
		type: String,
		default: 'default_dp.jpg',
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	fullName: {
		type: String,
		required: true,
	},
})

UserSchema.plugin(plm)

module.exports = mongoose.model('users', UserSchema)
