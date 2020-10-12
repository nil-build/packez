module.exports = function (options, state) {
	return {
		ignore(file) {
			return /\.ts$/.test(file);
		},
	};
};
