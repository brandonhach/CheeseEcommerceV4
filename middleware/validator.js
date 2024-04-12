exports.validateId = (req, res, next) => {
	let id = req.params.id;

	// check error
	if (!id.match(/^[0-9a-fA-F]{24}$/)) {
		let err = new Error(`Invalid cheese id: ${id}`);
		err.status = 400;
		return next(err);
	}
	next();
};
