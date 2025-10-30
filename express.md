# Express

express: is a framework for nodejs to deal with the web

Express is an unopinionated framework

| Opinionated                            | UnOpinionated                       |
| -------------------------------------- | ----------------------------------- |
| Suggested ways to do things            | Different ways to do the same thing |
| usually offer a lot of bells & whistle | Include the bare necessities        |
| Strict folder structure                | Struct folders how you want         |
| Features                               | Freedom                             |

---

## Content Table

- [Basics](#basics)
- [Sending files](#send-files)

---

## Basics

To install express

```npm
npm install express
```

Now create a JS file called **_server.js_** for example

Now lets require **_Express_** inside our application with this line

```js
const express = require("express");
```

To create an **_Express_** app we need to initiate **_Express_** with this line

```js
const app = express();
```

the **app** variable is our core application we can do anything from it

**_Express_** makes the dealing with the request methods much easier because we can just say something like

```js
app.get("/", (req, res) => {
	res.send("Hello, world!!!");
});
```

And we don't even need to specify the **Content-Type** it will know it automatically

```js
app.get("/", (req, res) => {
	res.send({ msg: "Hello, World!!!" });
});
```

Also it will stringify JS or JSON objects automatically

There is a specific json function

```js
let posts = [
	{ id: 1, title: "Post One" },
	{ id: 2, title: "Post Two" },
	{ id: 3, title: "Post Three" },
];

app.get("/api/posts", (req, res) => {
	res.json(posts);
});
```

To run our server and watch it use this command

```command line
node --watch server.js
```

We can created as many routs as we want this easily

```js
app.get("/about", (req, res) => {
	res.send("We are offering awesome servers");
});
```

This route means GET from /about

---

## Send Files

We can send file with **_sendFile_** method

```js
const path = require("path");
```

We can use the **path** package to help us doing this

```js
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/about", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "about.html"));
});
```

---

## Static Server

Now this way of sending files might work if we have a little number of pages but imagine if we have a lot of files and pages

To avoid repeating we can use the static files

we can remove our two routes and use this line instead

```js
app.use(express.static(path.join(__dirname, "public")));
```

**app.use** runs the middlewares

> Keep in mind you have to type file extension in the URL i.e. (http://localhost:8000/about.html)

---

## Dynamic Routes

Lets say we want a specific post

the endpoint in our code will be like this

```js
app.get("/api/posts/:id", (req, res) => {});
```

Were we say that the **id** is dynamic by putting a colon in front of it

we can access the **id** variable from the **req.params** and we will get all the params as strings

```js
app.get("/api/posts/:id", (req, res) => {
	const id = parseInt(req.params.id);
	const post = posts.find((p) => p.id === id);
	if (post) res.json(post);
	res.send({ msg: "post not found" });
});
```

Now you might want to access url queries
URL: localhost:8000/api/posts?limit=3
if we want to access the limit variable we can so using the **query** object inside the **req**

Ex: Get a certain number of posts

```js
// Get posts
app.get("/api/posts", (req, res) => {
	const limit = parseInt(req.query.limit) || posts.length;
	// We should return to stop executing and re-send the data again which will cause an error
	if (limit && limit > 0) return res.status(200).json(posts.slice(0, limit));
	res.json(posts);
});
```

> This customer data send from the user may be sometime very dangerous like sql injection or something crashes the server, so you need to verify the data and queries

to specify status codes, we can chain methods

```js
res.status(200).send("Every thing is ok");
```

---

## Separate Routes File

create a **routes** directory and a **posts.js** file in it to start using **_Express_** router

```js
// posts.js
const express = require("express");
const router = express.Router(); // create the router

let posts = [
	{ id: 1, title: "Post One" },
	{ id: 2, title: "Post Two" },
	{ id: 3, title: "Post Three" },
];

router.get("/", (req, res) => {
	const limit = parseInt(req.query.limit) || posts.length;
	if (limit && limit > 0) return res.status(200).json(posts.slice(0, limit));
	res.json(posts);
});

router.get("/:id", (req, res) => {
	const id = parseInt(req.params.id);
	const post = posts.find((p) => p.id === id);
	if (post) return res.status(200).json(post);
	res.status(404).send({ msg: "post not found" });
});

module.exports = router;
```

Since this route is specific for the "/api/posts" endpoint we don't need to say this inside the methods, because we will get this from the **server.js** file

```js
// server.js
const express = require("express");
const posts = require("./routes/posts");

const PORT = process.env.PORT || 8080;
const app = express();

app.use("/api/posts", posts);

app.listen(PORT, () => console.log(`server running at ${PORT}`));
```

This should still works the same

---

## Read data from request

To read json data from the request we need to add a middleware

```js
app.use(express.json());
```

To read url encoded data we need to add another line

```js
app.use(express.urlencoded());
```

Now to access the values send with the request we will found them inside the body

```js
console.log(req.body);
```

Ex: add a new post

```js
// Add new post
router.post("/", (req, res) => {
	if (!req.body) return res.status(400).json({ msg: "what a stupid request" });

	const title = req.body.title;
	if (!title) return res.status(400).json({ msg: "Post must have a title" });

	const post = {
		id: posts.length + 1,
		title,
	};
	posts.push(post);
	res.status(201).json(posts);
});
```

Ex: editing posts

```js
router.put("/:id", (req, res) => {
	const id = parseInt(req.params.id);
	const postIndex = posts.findIndex((p) => p.id === id);
	const post = posts[postIndex];
	if (!post) return res.status(404).json({ msg: "Post not found" });

	if (!req.body)
		return res.status(400).json({ msg: "Provide the needed data" });
	const title = req.body.title;
	if (!title) return res.status(400).json({ msg: "Post must have a title" });

	const newPost = { ...post, title };
	posts[postIndex] = newPost;
	res.status(200).json(newPost);
});
```

Ex: delete a post

```js
router.delete("/:id", (req, res) => {
	const id = parseInt(req.params.id);
	const postIndex = posts.findIndex((p) => p.id === id);
	if (postIndex === -1) return res.status(404).json({ msg: "Post not found" });
	const post = posts[postIndex];

	posts.splice(postIndex, 1);
	res.status(200).json(posts);
});
```

## Middleware

To implement middlewares on the router level we can do that

Basic syntax

```js
app.[method]([endpoint], [middleware], [request handler]);
```

Ex:

```js
const logger = (req, res, next) => {
	console.log(
		`${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`
	);
	next();
};

router.get("/", logger, getAllPosts);
```

To use it inside the **server.js** file we can do this

```js
app.use(logger); // Hit's every endpoint
// OR
app.use("/api/posts", logger, posts);
// OR
app.use("/api/posts", logger);
app.use("/api/posts", posts);
```

---

## Error handling

First we need to create an error and throw it to the middleware error handler

we need to accept the **_next_** function inside our request handlers

```js
app.get("/", (req, res, next) => {...});
```

to create and throw an error do like this

```js
const err = new Error("post not found");
return next(err);
```

Now lets create our handler inside the middle ware directory

```js
// error-handler.js
const errorHandler = (err, req, res, next) => {
	res.status(err.status || 501).json({ msg: err.message });
};
export default errorHandler;
```

Now we can use it like every other middleware just by wrapping it with the **use**

```js
app.use("/api/posts", errorHandler);
```

We can add dynamic status codes

```js
const err = new Error("post not found");
err.status = 404;
return next(err);
```

we will throw the error like this

Now we need to update our error handler

```js
const errorHandler = (err, req, res, next) => {
	res.status(err.status || 501).json({ msg: err.message });
};
export default errorHandler;
```

To catch all errors i.e. undefined endpoints

```js
app.use((req, res, next) => {
	const err = new Error("Page Not Found");
	err.status = 404;
	next(err);
});
```

> Make sure the errorHandler function is have the same endpoint as the catch all endpoint

it's better to create a separated file for this of course

```js
// not-found.js

const notFoundHandler = (req, res, next) => {
	const err = new Error("Page Not Found");
	err.status = 404;
	next(err);
};
export default notFoundHandler;
```

And we can just use it with our app as any other middleware

```js
app.use(notFoundHandler);
```

---

## Colors for the console

we will use a package called **colors** to add colors for the console

First install it with NPM

```npm
npm i colors
```

Basic syntax

```js
console.log([msg].[style1].[style2].[styleN]);
```

ex: make the msg green

```js
import "colors";
const logger = (req, res, next) => {
	console.log(
		`${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`.green
	);
	next();
};
export default logger;
```

see styles here [colors](https://www.npmjs.com/package/colors)

Now to take this further we can map each method with its own color

```js
colors.setTheme({
	GET: "green",
	POST: "blue",
	PUT: "yellow",
	DELETE: "red",
});

console.log(
	`${method} ${req.protocol}://${req.get("host")}${req.originalUrl}`[method]
);
```

---

## Encapsulate logic

Let us extract some of the code from the posts router to it's own file logic, create a **controller** directory

Just copy the functions to separate file for example **controller.js**:

```js
import express from "express";
import {
	addPost,
	deletePost,
	getPost,
	getPosts,
	updatePost,
} from "../controllers/post-controller.js";

const router = express.Router();

router.get("/", getPosts);

// Get post by id
router.get("/:id", getPost);

// Add new post
router.post("/", addPost);

router.put("/:id", updatePost);

router.delete("/:id", deletePost);

export default router;
```

---

## Create some request form the frontend

inside the **index.html** let's create a button for fetching posts
