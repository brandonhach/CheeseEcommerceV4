const Cheese = require('../models/cheese');

exports.isGuest = (req, res, next) => {
	if (!req.session.user) {
		return next();
	} else {
		req.flash('error', 'You are logged in already');
		return res.redirect('/user/profile');
	}
};

exports.isLoggedIn = (req, res, next) => {
	if (req.session.user) {
		return next();
	} else {
		req.flash('error', 'You need to log in first');
		return res.redirect('/user/login');
	}
};

exports.isAuthor = (req, res, next) => {
	let id = req.params.id;

	Cheese.findById(id)
		.then((cheese) => {
			if (cheese) {
				if (cheese.seller == `${req.session.firstName} ${req.session.lastName}`) {
					return next();
				} else {
					let err = new Error('Unauthorized to access the resource');
					err.status = 401;
					return next(err);
				}
			} else {
				let err = new Error('Cannot find a cheese with id ' + id);
				err.status = 404;
				return next(err);
			}
		})
		.catch((err) => next(err));
};
