// Prevent user from visiting page without logging in
module.exports = {
	ensureAuth: (req, res, next) => {
		if(req.isAuthenticated()) {
			return next()
		}
		else {
			// Not authenticated == return to Login page
			res.redirect('/')
		}
	},
	ensureGuest: (req, res, next) => {
		if(req.isAuthenticated()) {
			res.redirect('/dashboard')
		}
		else {
			return next()
		}
	}
}