const model = require('../models/cheese');

/**GET /items: send all cheese listing to the user x */
exports.index = (req, res) => {
	model
		.find()
		.sort({ price: 1 })
		.then((cheeses) => res.render('./cheese/items', { cheeses }))
		.catch((err) => {
			console.log(err);
			next.err;
		});
};

/**GET /item/:id : send details of cheese identified by id x*/
exports.item = (req, res, next) => {
	let id = req.params.id;
	if (!id.match(/^[0-9a-fA-F]{24}$/)) {
		let err = new Error('Invalid story id');
		err.status = 400;
		return next(err);
	}
	model
		.findById(id)
		.then((cheese) => {
			try {
				if (cheese) {
					return res.render('./cheese/item', { cheese });
				} else {
					let err = new Error('Cannot find cheese with id ' + id);
					err.status = 400;
					next(err);
				}
			} catch (error) {
				console.log('Failed to create cheese listing:', error);
				next(error);
			}
		})
		.catch((err) => next(err));
};

/**POST /post_cheese : create a new cheese listing x */
exports.create = (req, res, next) => {
	let cheese = new model(req.body); //create a new cheese document
	cheese.seller = `${req.session.firstName} ${req.session.lastName}`; //new here
	cheese.image = '/images/uploads/' + req.file.filename;
	cheese.author = req.session.user;
	let item = new model(cheese);
	try {
		item.save().then((cheese) => {
			console.log(cheese);
			res.redirect('/listing');
		});
	} catch (err) {
		if (err.name === 'ValidationError') {
			err.status = 400;
		}
		console.log('Failed to create cheese listing:', err);
		next(err);
	}
};

/**GET /new : create a new cheese listing x */
exports.new = (req, res) => {
	res.render('./cheese/new');
};

/**DELETE /item/:id : delete a cheese listing */
exports.delete = (req, res, next) => {
	let id = req.params.id;
	if (!id.match(/^[0-9a-fA-F]{24}$/)) {
		let err = new Error('Invalid story id');
		err.status = 400;
		return next(err);
	}
	try {
		model
			.findByIdAndDelete(id, { useFindAndModify: false })
			.then((cheese) => {
				if (cheese) {
					res.redirect('/listing');
				} else {
					let err = new Error('Cannot delete cheese with id ' + id);
					err.status = 400;
					next(err);
				}
			})
			.catch((err) => {
				if (err.name === 'ValidationError') {
					err.status = 400;
				}
				next(err);
			});
	} catch (error) {
		console.error('Failed to delete cheese listing:', error);
		next(error);
	}
};

/**UPDATE /item/:id : update a cheese listing x */
exports.update = (req, res, next) => {
	let id = req.params.id;
	if (!id.match(/^[0-9a-fA-F]{24}$/)) {
		let err = new Error('Invalid story id');
		err.status = 400;
		return next(err);
	}

	let updatedCheese = {
		title: req.body.title,
		condition: req.body.condition,
		price: req.body.price,
		seller: req.body.seller,
		details: req.body.details,
	};

	try {
		if (req.file) {
			updatedCheese.image = '/images/uploads/' + req.file.filename;
		}

		model
			.findByIdAndUpdate(id, updatedCheese, { useFindAndModify: false, runValidators: true })
			.then((cheese) => {
				if (cheese) {
					res.redirect('/listing/item/' + id);
				} else {
					let err = new Error('Cannot delete cheese with id ' + id);
					err.status = 400;
					next(err);
				}
			})
			.catch((err) => {
				if (err.name === 'ValidationError') {
					err.status = 400;
				}
				next(err);
			});
	} catch (error) {
		console.error('Failed to update cheese listing:', error);
		next(error);
	}
};

/**GET /item/:id/edit : create a new cheese listing x */
exports.edit = (req, res, next) => {
	let id = req.params.id;
	if (!id.match(/^[0-9a-fA-F]{24}$/)) {
		let err = new Error('Invalid story id');
		err.status = 400;
		return next(err);
	}

	model
		.findById(id)
		.then((cheese) => {
			try {
				if (cheese) {
					res.render('./cheese/edit', { cheese });
				} else {
					let err = new Error('Cannot find a cheese with id ' + id);
					err.status = 400;
					next(err);
				}
			} catch (error) {
				console.error('Failed to edit cheese listing:', error);
				next(error);
			}
		})
		.catch((err) => next(err));
};

/**GET /item/:id : search for cheese listing via title and/or detail field (case-sens) */
exports.search = (req, res, next) => {
	const query = req.query.searchBar;

	if (query) {
		const searchCondition = {
			$or: [{ title: { $regex: query, $options: 'i' } }, { details: { $regex: query, $options: 'i' } }],
		};
		model
			.find(searchCondition)
			.then((cheeses) => {
				res.render('./cheese/items', { cheeses });
			})
			.catch((error) => {
				console.error('An error occurred during the search.', error);
				next(error);
			});
	} else {
		res.redirect('/cheese/items');
	}
};
