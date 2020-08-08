const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const exphbs = require('express-handlebars'); // Handlebars
const path = require('path');

// Load config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport)

// Call DB after loading the config***
connectDB();

const app = express();
// Any requests will show in console using morgan
process.env.NODE_ENV === 'development' ? app.use(morgan('dev')) : ''

//Sessions
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false,
}))
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Handlebars
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
// Static folder
app.use(express.static(path.join(__dirname, 'public')))


// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));