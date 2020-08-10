const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
// Models
const Story = require('../models/Story');

// @desc	Login/Landing page
// @route 	GET /api
router.get('/', ensureGuest, (req, res) => {
	res.render('login', {
		layout: 'login',
	})
})


// @desc	Dashboard
// @route 	GET /api/dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
	try {
		const stories = await Story.find({ user: req.user.id }).lean()
		res.render('dashboard', {
			name: req.user.firstName,
			stories
		})
	}
	catch(err) {
		console.err(err);
		res.render('error/500') // render views template engine
	}


})


module.exports = router;