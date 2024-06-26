const User = require('../models/user');
const Cheese = require('../models/cheese');

exports.new = (req, res) => {
	res.render('./user/new', {
		errorMessages: req.flash('error'),
		successMessages: req.flash('success'),
	});
};

exports.create = (req, res, next) => {
	let user = new User(req.body);
	user.save()
		.then((user) => {
			req.flash('success', 'Account successfully created! You can now log in.');
			res.redirect('/users/login');
		})
		.catch((err) => {
			if (err.name === 'ValidationError') {
				req.flash('error', err.message);
				res.redirect('/users/new');
			} else if (err.code === 11000) {
				req.flash('error', 'The email address is already in use.');
				res.redirect('/users/new');
			} else {
				console.error(err);
				next(err);
			}
		});
};

exports.getUserLogin = (req, res) => {
	res.render('./user/login');
};

exports.login = (req, res) => {
	let email = req.body.email;
	let password = req.body.password;
	console.log(req.flash());
	//get the user that matches the email
	User.findOne({ email: email }).then((user) => {
		if (user) {
			//user found in the db
			user.comparePassword(password).then((result) => {
				if (result) {
					req.session.user = user.id;
					req.session.firstName = user.firstName;
					req.session.lastName = user.lastName;
					req.flash('success', 'You have successfully logged in');
					res.redirect('/users/profile');
				} else {
					console.log('wrong password');
					req.flash('error', 'Wrong password');
					res.redirect('/users/login');
				}
			});
		} else {
			console.log('wrong email address');
			req.flash('error', 'Wrong email');
			res.redirect('/users/login');
		}
	});
};

exports.profile = (req, res, next) => {
	let id = req.session.user;
	Promise.all([User.findById(id), Cheese.find({ author: id })])
		.then((result) => {
			const [user, cheeses] = result;
			res.render('./user/profile', { user, cheeses });
		})
		.catch((err) => next(err));
};

exports.logout = (req, res, next) => {
	req.session.destroy((err) => {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
};
