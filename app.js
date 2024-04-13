//require modules
const express = require('express');
const morgan = require('morgan');
const cheeseListingRoutes = require('./routes/cheeseRoutes');
const userRoutes = require('./routes/userRoutes');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

//create app
const app = express();

//config app
let port = 3000;
let host = 'localhost';
let url = '';
app.set('view engine', 'ejs');

//mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(
	session({
		secret: 'dookie',
		resave: false,
		saveUninitialized: false, // false to not store session in memory
		cookie: { maxAge: 60 * 60 * 1000 },
		store: new MongoStore({ mongoUrl: url }),
	})
);

app.use(flash());
app.use((req, res, next) => {
	res.locals.user = req.session.user || null;
	res.locals.successMessages = req.flash('success');
	res.locals.errorMessages = req.flash('error');
	next();
});

//set up routes
app.get('/', (req, res) => {
	res.render('index');
});
app.get('/favicon.ico', (req, res) => res.status(204).send());

app.use('/listing', cheeseListingRoutes);
app.use('/users', userRoutes);

//error-handler
app.use((req, res, next) => {
	let err = new Error('The server cannot locate ' + req.url);
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) => {
	console.log(err.stack);
	if (!err.status) {
		err.status = 500;
		err.message = 'Internal Server Error';
	}

	res.status(err.status);
	res.render('error', { error: err });
});

//listen during startup
//connect to database
mongoose
	.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		app.listen(port, host, () => {
			console.log('Server is running on port', port);
		});
	})
	.catch((err) => console.log(err.message));
