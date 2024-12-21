module.exports.createError = (status, message) => {
	const err = new Error()
	err.status = status
	err.message = message
	return err
}

module.exports.catchError = (err, req, res, next) => {
	console.error(err)
	const status = err.status || 500
	const message = err.message || "Something went wrong"
	return res.status(status).json({
		success: false,
		status,
		message
	})
}
