const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const exphbs = require('express-handlebars'); // Handlebars
const path = require('path');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// Load config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport)

// Call DB after loading the config***
connectDB();

const app = express();
// Any requests will show in console using morgan
process.env.NODE_ENV === 'development' ? app.use(morgan('dev')) : ''
//body pareser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method overrride
app.use(methodOverride((req, res) => {
	if(req.body && typeof req.body === 'object' && '_method' in req.body) {
		let method = req.body._method
		delete req.body._method
		return method
	}
}))

//Sessions ****
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({ mongooseConnection: mongoose.connection }) // Storing user session on refresh
}))
// Passport middleware ****
app.use(passport.initialize());
app.use(passport.session());

// Set Global variable
app.use((req, res, next) => {
	res.locals.user = req.user || null
	next()
})


//Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, select} = require('./helpers/hbs')
// Handlebars
app.engine('.hbs', exphbs({ helpers: { formatDate, stripTags, truncate, editIcon, select }, defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
// Static folder
app.use(express.static(path.join(__dirname, 'public')))


// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));