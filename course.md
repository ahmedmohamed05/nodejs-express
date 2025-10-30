# Nodejs

Content Table

- [Modeling System](#change-importexport-type)
- [HTTP Server](#create-http-server)
- [Status Codes](#status-code)
- [NPM Scripts](#edit-npm-scripts)
- [.env File](#env-file)
- [Request Object](#request-object)
- [Load Files (fs)](#load-files)
- [JSON](#json)
- [middleware](#middleware)

Init the project with **_package.json_** file for project configuration

```npm
npm init -y
```

this will crate a **_package.json_** file contains all the necessary information to build your project

---

## Change Import/Export type

in **_package.json_** you can change the type of module system **_commonjs_** which uses `require, export` keywords or **_module_** uses `import, export`

inside the **_package.json_** file type

```json
"type": [commonjs or module]
```

---

## Create HTTP server

to create HTTP server first we need to import the http library from the node environment (comes with it by default)

```js
import http from "http"; // Module
const http = require("http"); // Commonjs
```

Now to create a server

```js
const server = http.createServer((req, res) => {});
```

**req**: Request object for authentication and other stuff
**res**: Response for the client

Ex: Response with hello world

```js
const server = http.createServer((req, res) => {
	res.write("Hello, World !!!");
	res.end();
});
```

**write**: used to write text to the response

**end**: Ends the response and return it to the client

Now we have to create a listener for any one connect to our server

```js
const PORT = 8000;
server.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});
```

Now our code will look like this

```js
import http from "http";

const PORT = 8000;

const server = http.createServer((req, res) => {
	res.write("Hello, World !!!");
	res.end();
});

server.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});
```

if our response is simple we can return it immediately within the **end** method

```js
const server = http.createServer((req, res) => {
	res.end("Hello, World !!!");
});
```

we can set header values to tell the brows how to handle/display our response such as html

```js
const server = http.createServer((req, res) => {
	res.setHeader("Content-Type", "text/html"); //renders html
	res.end("<h1>Hello, World !!!</h1>");
});
```

```js
const server = http.createServer((req, res) => {
	res.setHeader("Content-Type", "text/plain"); //renders plain text including the tags
	res.end("<h1>Hello, World !!!</h1>");
});
```

---

## Status Code

Status code: Number indicate the status of the request asks, if the request contains pages not found we might want to response with status code $404$

Or if everything is fine the status code will be $200$

Ex: Return status code of 404

```js
import http from "http";

const PORT = 8000;

const server = http.createServer((req, res) => {
	res.setHeader("Content-Type", "text/html");
	res.statusCode = 404;

	res.end("<h1>Hello, World !!!</h1>");
});

server.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});
```

Open the console and will see an error saying **404 not found**

We can use the **writeHead** method to write head in one line

```js
const server = http.createServer((req, res) => {
	res.writeHead(500, { "Content-Type": "application/json" }); // 500 = internal server error
	res.end(JSON.stringify({ msg: "Error" }));
});
```

---

## Edit NPM scripts

We can edit npm scripts to do certain things to avoid repeating, Open **_package.json_** you will see a script key with a scripts strings and each script has a name

to run the script write

```npm
npm run [script-name]
```

Ex:

```npm
npm run start
```

We can add our own scripts of course

We will add an npm package to restart our server each time we make a change called **_nodemon_**

```npm
npm i -D nodemon
```

**_-D_** flat means that this package is only needed for development and not production

After running the command two things changed

1. **node_modules**: This directory contains all our modules needed to run our project, No need to copy this big directory everywhere because you can install the needed modules if you have the **_package.json_** file

2. **package-lock.json**: Contains our dependencies information

3. **package.json**: see new object crated **devDependencies**

> we can install the node_modules directory just by running

```npm
npm install
```

> You might want to ignore the directory inside your **_.gitignore_** file

Now after installing **_nodemon_** we can edit our start script to this

```json
"start": "nodemon [server-file-name.js]"
```

Ex:

```json
"scripts": {
  "start": "nodemon index.js",
  "test": "node ."
},
```

---

## env File

With new nodejs versions you don't need to install a packages to use .env variables

But you have to add **_--env-file=[file-path]_** to the running command

Ex:

```json
"start": "nodemon --env-file=.env index.js",
```

We can access env variables using the process object

```js
const PORT = process.env.PORT;
```

---

## Request Object

```js
const server = http.createServer((req, res) => {
	console.log(req.url); // Get Client's url
	console.log(req.method); // Request type, GET by default

	res.writeHead(200, { "Content-Type": "text/html" });
	res.end(`<h1>Hello, World !!!</h1>`);
});
```

Based on the data from url for routing and method for action type we can handle many requests

Ex: Load different pages based on the rout

```js
const server = http.createServer((req, res) => {
	const url = req.url;
	if (url === "/") {
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(`<h1>Homepage</h1>`);
	} else if (url === "/users") {
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(`<h1>Users</h1>`);
	} else {
		res.writeHead(404, { "Content-Type": "text/html" });
		res.end(`<h1>Not Found</h1>`);
	}
});
```

But the problem with this code it will always return data even if the request was a POST request (adding data)

we can use _Try/Catch_ to handle this

```js
const server = http.createServer((req, res) => {
	const url = req.url;
	const method = req.method;

	try {
		if (method === "GET") {
			if (url === "/") {
				res.writeHead(200, { "Content-Type": "text/html" });
				res.end(`<h1>Homepage</h1>`);
			} else if (url === "/users") {
				res.writeHead(200, { "Content-Type": "text/html" });
				res.end(`<h1>Users</h1>`);
			} else {
				res.writeHead(404, { "Content-Type": "text/html" });
				res.end(`<h1>Not Found</h1>`);
			}
		} else throw new Error("Method Not allows");
	} catch (error) {
		res.writeHead(500, { "Content-Type": "text/plain" });
		res.end("Server Error");
	}
});
```

---

## Load Files

First we need to import the fs library, the promises versions

```js
import fs from "fs/promises";
```

Now to get current file path

If you are not using es-module you have to variables **_\_\_filename, \_\_dirname_** you can use

but if you are using es-module, you might need to write more code

1. You need to import **_url, path_** libraries
2. Get filename

```js
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

Now there is a new way to get the same results with nodejs <=20.11+

you can simply write

```js
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
```

Ex: return html pages

> Since we will work with promises we should change our function to asynchronous

1:

```js
const server = http.createServer(async (req, res) => {...});
```

2: Create index.html, about.html, and not-found.html files inside the public directory

3: make this changes to the function

```js
const server = http.createServer(async (req, res) => {
	const url = req.url;
	const method = req.method;
	try {
		if (method === "GET") {
			let filePath;
			if (url === "/") {
				filePath = path.join(__dirname, "public", "index.html");
			} else if (url === "/about") {
				filePath = path.join(__dirname, "public", "about.html");
			} else {
				filePath = path.join(__dirname, "public", "not-found.html");
			}

			const data = await fs.readFile(filePath);
			res.setHeader("Content-Type", "text/html");
			res.end(data);
		} else throw new Error("Method Not allows");
	} catch (error) {
		res.writeHead(500, { "Content-Type": "text/plain" });
		res.end("Server Error");
	}
});
```

---

## JSON

Ex: Return todos

> This todos are hardcoded, In real-world project they will come from DB

```js
import { createServer } from "http";

const TODOS = [
	{ id: 1, todo: "Throw the trash", status: false },
	{ id: 2, todo: "Do homework", status: true },
	{ id: 3, todo: "Bullying my sisters", status: true },
];

const server = createServer((req, res) => {
	if (req.method === "GET" && req.url === "/api/todos") {
		res.setHeader("Content-Type", "application/json");
		res.write(JSON.stringify(TODOS));
		res.end();
	} else {
		res.setHeader("Content-Type", "application/json");
		req.statusCode = 404;
		res.write(JSON.stringify({ msg: "Route not found" }));
		res.end();
	}
});
```

Ex: Get specific todo with it's id

```js
const TODOS = [
	{ id: 1, todo: "Throw the trash", status: false },
	{ id: 2, todo: "Do homework", status: true },
	{ id: 3, todo: "Bullying my sisters", status: true },
];

const server = createServer((req, res) => {
	res.setHeader("Content-Type", "application/json");

	// Get all todos
	if (req.method === "GET" && req.url === "/api/todos") {
		res.write(JSON.stringify(TODOS));
		res.end();
		return; // Early return - no else needed!
	}

	// Get single todo
	if (req.method === "GET" && req.url.match(/\/api\/todos\/([0-9]+)/)) {
		const id = parseInt(req.url.split("/")[3]);
		const todo = TODOS.find((todo) => todo.id === id);

		if (todo) {
			res.write(JSON.stringify(todo));
			res.end();
			return;
		}

		res.statusCode = 404;
		res.write(JSON.stringify({ msg: "Todo not found" }));
		res.end();
		return;
	}

	// Default 404
	res.statusCode = 404;
	res.write(JSON.stringify({ msg: "Route not found" }));
	res.end();
});
```

---

## Middleware

Functions runs in the middle of a request lets you edit the headers of the request, authentication stuff for example

Ex: create a logger function to record each time a todo requested

```js
const logger = async (req, res, next) => {
	try {
		const { method, url } = req;
		const content = `Method: ${method}, URL: ${url}\n`;
		await fs.writeFile(
			path.join(import.meta.dirname, "logs", "todos.txt"),
			content,
			{ flag: "a+" } // flag to append to the file
		);
		next();
	} catch (error) {
		throw new Error(error);
	}
};
```

Since this is a middleware we have to call the next function

Also we need to wrap our server initial function inside a function

```js
const server = createServer((req, res) => {
	logger(req, res, () => {
		// when we call the 'next' function this code will execute
		res.setHeader("Content-Type", "application/json");

		// Get all todos
		if (req.method === "GET" && req.url === "/api/todos") {
			res.write(JSON.stringify(TODOS));
			res.end();
			return; // Early return - no else needed!
		}

		// Get single todo
		if (req.method === "GET" && req.url.match(/\/api\/todos\/([0-9]+)/)) {
			const id = parseInt(req.url.split("/")[3]);
			const todo = TODOS.find((todo) => todo.id === id);

			if (todo) {
				res.write(JSON.stringify(todo));
				res.end();
				return;
			}

			res.statusCode = 404;
			res.write(JSON.stringify({ msg: "Todo not found" }));
			res.end();
			return;
		}

		// Default 404
		res.statusCode = 404;
		res.write(JSON.stringify({ msg: "Route not found" }));
		res.end();
	});
});
```

---

## POST data

First let's clean up our code (it will be easier if we use express)

```js
const getAllTodos = (req, res) => {
	res.write(JSON.stringify(TODOS));
	res.end();
};

const getTodoById = (req, res) => {
	const id = parseInt(req.url.split("/")[3]);
	const todo = TODOS.find((todo) => todo.id === id);

	if (todo) {
		res.write(JSON.stringify(todo));
		res.end();
		return;
	}

	res.statusCode = 404;
	res.write(JSON.stringify({ msg: "Todo not found" }));
	res.end();
};

const server = createServer((req, res) => {
	logger(req, res, () => {
		res.setHeader("Content-Type", "application/json");

		// Get all todos
		if (req.method === "GET" && req.url === "/api/todos") {
			getAllTodos(req, res);
			return;
		}

		if (req.method === "GET" && req.url.match(/\/api\/todos\/([0-9]+)/)) {
			getTodoById(req, res);
			return;
		}

		// Default 404
		res.statusCode = 404;
		res.write(JSON.stringify({ msg: "Route not found" }));
		res.end();
	});
});
```

---

## Files (FS)

We already used it a little

Ex: read the log file

```js
import fs from "fs";

fs.readFile("./logs/todos.txt", "utf8", (err, data) => {
	if (err) throw err;
	console.log(data);
});
```

Now the above example is the asynchronisms versions which will not block your code, it will execute the callback function once the file has read

```js
const data = fs.readFileSync("./logs/todos.txt", "utf8");
console.log(data);
```

This code will stop running the rest until finishing reading the file

There is a promise version of the **_fs_** library, where you can use the .then or async/await

```js
fs.readFile(LOG_FILE_PATH, "utf8")
	.then((data) => console.log(data))
	.catch((err) => console.log(err));
```

```js
const readFile = async () => {
	try {
		const data = await fs.readFile(LOG_FILE_PATH, "utf8");
		console.log(data);
	} catch (error) {
		console.error(error);
	}
};

readFile();
```

Now this is the 4 different ways to use almost all the methods inside the fs library

Writing to file

```js
const writeFile = async () => {
	try {
		await fs.writeFile("./test.txt", "Hello, World");
	} catch (error) {
		console.error(error);
	}
};

writeFile();
```

**_writeFile_** will create the file if not exists

## More about path module

Gives you the ability to work with filepaths (doesn't matter if the path exists or not)

```js
import path from "path";
const filepath = "./dir1/dir2/main.cpp";
```

this filepath we will work with

1: basename: Gives the last path name

```js
console.log(path.basename(filepath)); // main.cpp
```

2: dirname: path without the filepath

```js
console.log(path.dirname(filepath)); // ./dir1/dir2
```

3: extname: file extension

```js
console.log(path.extname(filepath)); // .cpp
```

4: parse: parse the path and returns an object

```js
console.log(path.parse(filepath));
```

```json
{
	"root": "",
	"dir": "./dir1/dir2",
	"base": "main.cpp",
	"ext": ".cpp",
	"name": "main"
}
```

---

## Os module

importing

```js
import os from "os";
```

1: userInfo: Returns an object with the username uid, gid, homedir and shell type

```js
console.log(os.userInfo());
```

2: totalmem: Returns total memory in bytes

```js
console.log(os.totalmem());
```

3: freemem: Returns free memory in bytes

```js
console.log(os.freemem());
```

4: cpus: Returns an array of object for every core on the system

```js
console.log(os.cpus());
```

---

## URL module

Importing the url module

```js
import url from "url";
```

create example url

```js
const ex = "https://duckduckgo.com/?q=hello+world";
```

1: new url: get an object contain information about the url

```js
const urlObject = new URL(ex);

console.log(urlObject);
```

2: format: get url string from an object

```js
console.log(url.format(urlObject));
```

3: import.meta.url: get the url of the file

```js
console.log(import.meta.url);
```

4: get url params

```js
const params = new URLSearchParams(urlObject.search); // Returns a map
console.log(params.get("q"));
```

---

## Crypto

importing

```js
import crypto from "crypto";
```

```js
const hash = crypto.createHash("sha256");
hash.update("ahmed");
console.log(hash.digest("hex"));
```

to create random hashes

```js
crypto.randomBytes(16, (err, buf) => {
	if (err) throw err;
	console.log(buf.toString("hex"));
});
```

Encrypt

```js
const ALGORITHM = "aes-256-cbc";
const KEY = crypto.randomBytes(32);
const IV = crypto.randomBytes(16);

const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
let encrypted = cipher.update("Hello Please encrypt this", "utf8", "hex");
encrypted += cipher.final("hex");
console.log(encrypted);
```

Decrypting

```js
const decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);
let decrypted = decipher.update(encrypted, "hex", "utf8");
decrypted += decipher.final("utf8");
console.log(decrypted);
```

---

## Events

Great for real-time applications because you can create events and listen to them inside you front-end app

importing

```js
import { EventEmitter } from "events";
```

Ex: simple emitter

```js
import { EventEmitter } from "events";

const emitter = new EventEmitter();

function initializer(user) {
	console.log("initial");
}

function finalizer() {
	console.log("final");
}

emitter.on("initialize", initializer);
emitter.on("finalize", finalizer);

emitter.emit("initialize");
emitter.emit("finalize");
```

We can send arguments

```js
import { EventEmitter } from "events";

const emitter = new EventEmitter();

function initializer(username) {
	console.log("initial user: " + username);
}

function finalizer(username) {
	console.log("exiting, " + username);
}

emitter.on("initialize", initializer);
emitter.on("finalize", finalizer);

emitter.emit("initialize", "ahmed");
emitter.emit("finalize", "ahmed");
```

We can handle errors

```js
emitter.on("error", (err) => {
	console.error("Error occurred: " + err);
});

emitter.emit("error", new Error("Simulating"));
```

---

## Process

Process object has an argv array which contain the path for the node, and for the file runs, we can access any other arguments passed from the command line from this array

process.env gives you a lot of information about the environment that it's running on

We can exit the program with status code

```js
process.exit(0);

// This will never execute
console.log("exit successfully");
```

we can listen to events, exit event for example

```js
process.on("exit", (code) => {
	console.log(`program exit with status code of ${code}`);
});

process.exit(0);

// This will never execute
console.log("exit successfully");
```
