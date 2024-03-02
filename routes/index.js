var express = require('express')
var router = express.Router()

const passport = require('passport')
const expressSession = require('express-session')

// our models:
var userModel = require('./users')
var postModel = require('./posts')
const upload = require('./multer')

const localStrategy = require('passport-local').Strategy
passport.use(new localStrategy(userModel.authenticate()))

router.get('/profile', isLoggedIn, async function (req, res, next) {
	const user = await userModel.findById(req.user.id).populate('posts')
	res.render('profile', { user })
})

router.post('/upload', isLoggedIn, upload.single('file'), async (req, res) => {
	if (!req.file) {
		return res.status(400).send('No files were uploaded.')
	}
	const user = await userModel.findById(req.user.id)
	const post = await postModel.create({
		imageText: req.body.caption,
		image: req.file.filename,
		user: req.user.id,
	})

	user.posts.push(post)
	await user.save()
	res.redirect('/profile')
	// res.send({ success: true })
})

router.get('/feed', function (req, res, next) {
	res.render('feed')
})

router.get('/', function (req, res, next) {
	res.render('index')
})

router.get('/login', function (req, res, next) {
	res.render('login', { message: req.flash('error') })
})

// router.get('/createUser', async function (req, res, next) {
// 	const user = await userModel.create({
// 		username: 'Ahsan',
// 		password: '121212',

// 		email: 'za@50gmail.com',
// 		fullName: 'ahsan Zahoor',
// 	})
// 	res.send(user)
// })

// router.get('/createPost', async function (req, res, next) {
// 	const post = await postModel.create({
// 		postText: 'Hello world',
// 		user: '65db2d2584ba8f3d65047fa8',
// 	})
// 	const user = await userModel.findById('65db2d2584ba8f3d65047fa8')
// 	user.posts.push(post._id)
// 	await user.save()
// 	res.send('done')
// })

// router.get('/getPosts', async function (req, res, next) {
// 	const user = await userModel
// 		.findById('65db2d2584ba8f3d65047fa8')
// 		.populate('posts')
// 	res.send(user)
// })

router.post('/register', async function (req, res, next) {
	const user = new userModel({
		username: req.body.username,
		email: req.body.email,
		fullName: req.body.fullName,
	})
	userModel.register(user, req.body.password).then(function () {
		passport.authenticate('local')(req, res, function () {
			res.redirect('/profile')
		})
	})
})

router.post(
	'/login',
	passport.authenticate('local', {
		failureRedirect: '/login',
		successRedirect: '/profile',
		failureFlash: true,
	}),
	function (req, res) {}
)

router.get('/logout', function (req, res) {
	req.logOut((err) => {
		if (err) {
			return next(err)
		}
		res.redirect('/')
	})
})

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect('/login')
}

module.exports = router
