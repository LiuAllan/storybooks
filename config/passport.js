const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = (passport) => {
	passport.use(new GoogleStrategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: '/auth/google/callback'
	},
	async (accessToken, refreshToken, profile, done) => {
		// User object from Google data
		const newUser = {
			googleId: profile.id,
			displayName: profile.displayName,
			firstName: profile.name.givenName,
			lastName: profile.name.familyName,
			image: profile.photos[0].value
		}

		try {
			// Check in database if user exists
			let user = await User.findOne( { googleId: profile.id })
			if(user) {
				done(null, user) // stores in DB
			}
			// Create a new user
			else {
				user = await User.create(newUser)
				done(null, user) // stores in DB
			}
		} 
		catch(err) {
			console.error(err);
		}
	}))

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => done(err, user))
	})
}