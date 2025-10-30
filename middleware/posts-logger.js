import colors from "colors";

const logger = (req, res, next) => {
	const method = req.method;
	colors.setTheme({
		GET: "green",
		POST: "blue",
		PUT: "yellow",
		DELETE: "red",
	});

	console.log(
		`${method} ${req.protocol}://${req.get("host")}${req.originalUrl}`[method]
	);
	next();
};

export default logger;
