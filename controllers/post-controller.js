const posts = [
	{ id: 1, title: "Post One" },
	{ id: 2, title: "Post Two" },
	{ id: 3, title: "Post Three" },
];

/**
 * Get all posts with optional limit
 *
 * @route   GET /api/posts
 * @param   {Object} req - Express request object
 * @param   {Object} req.query - Query parameters
 * @param   {string} req.query.limit - Optional limit for number of posts to return
 * @param   {Object} res - Express response object
 * @returns {Object} 200 - Array of post objects
 * @example
 * // Get all posts
 * GET /api/posts
 *
 * // Get first 2 posts
 * GET /api/posts?limit=2
 */
export const getPosts = (req, res) => {
	const limit = parseInt(req.query.limit) || posts.length;
	if (limit && limit > 0) return res.status(200).json(posts.slice(0, limit));
	res.json(posts);
};

/**
 * Get a single post by ID
 *
 * @route   GET /api/posts/:id
 * @param   {Object} req - Express request object
 * @param   {Object} req.params - URL parameters
 * @param   {string} req.params.id - Post ID
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 * @returns {Object} 200 - Single post object if found
 * @returns {Object} 404 - Error object if post not found
 * @example
 * // Get post with ID 1
 * GET /api/posts/1
 *
 * // Response: { id: 1, title: "Post One" }
 */
export const getPost = (req, res, next) => {
	const id = parseInt(req.params.id);
	const post = posts.find((p) => p.id === id);
	if (post) return res.status(200).json(post);

	const err = new Error("post not found");
	err.status = 404;
	return next(err);
};

/**
 * Create a new post
 *
 * @route   POST /api/posts
 * @param   {Object} req - Express request object
 * @param   {Object} req.body - Request body
 * @param   {string} req.body.title - Title of the post (required)
 * @param   {Object} res - Express response object
 * @returns {Object} 201 - Array of all posts including the newly created one
 * @returns {Object} 400 - Error message if request body or title is missing
 * @example
 * // Create a new post
 * POST /api/posts
 * Body: { "title": "My New Post" }
 *
 * // Response: [{ id: 1, title: "Post One" }, ..., { id: 4, title: "My New Post" }]
 */
export const addPost = (req, res) => {
	if (!req.body) return res.status(400).json({ msg: "what a stupid request" });

	const title = req.body.title;

	console.log(title);
	if (!title) return res.status(400).json({ msg: "Post must have a title" });

	const post = {
		id: posts.length + 1,
		title,
	};
	posts.push(post);
	res.status(201).json(posts);
};

/**
 * Update an existing post by ID
 *
 * @route   PUT /api/posts/:id
 * @param   {Object} req - Express request object
 * @param   {Object} req.params - URL parameters
 * @param   {string} req.params.id - Post ID to update
 * @param   {Object} req.body - Request body
 * @param   {string} req.body.title - New title for the post (required)
 * @param   {Object} res - Express response object
 * @returns {Object} 200 - Array of all posts with updated post
 * @returns {Object} 404 - Error message if post not found
 * @returns {Object} 400 - Error message if request body or title is missing
 * @example
 * // Update post with ID 1
 * PUT /api/posts/1
 * Body: { "title": "Updated Title" }
 *
 * // Response: [{ id: 1, title: "Updated Title" }, ...]
 */
export const updatePost = (req, res) => {
	const id = parseInt(req.params.id);
	const post = posts.find((p) => p.id === id);
	if (!post) return res.status(404).json({ msg: "Post not found" });

	if (!req.body)
		return res.status(400).json({ msg: "Provide the needed data" });
	const title = req.body.title;
	if (!title) return res.status(400).json({ msg: "Post must have a title" });

	post.title = title;
	res.status(200).json(posts);
};

/**
 * Delete a post by ID
 *
 * @route   DELETE /api/posts/:id
 * @param   {Object} req - Express request object
 * @param   {Object} req.params - URL parameters
 * @param   {string} req.params.id - Post ID to delete
 * @param   {Object} res - Express response object
 * @returns {Object} 200 - Object containing remaining posts and deleted post
 * @returns {Object} 404 - Error message if post not found
 * @example
 * // Delete post with ID 1
 * DELETE /api/posts/1
 *kkkkkkkkkk
 * // Response: {
 * //   posts: [{ id: 2, title: "Post Two" }, ...],
 * //   deletedPost: { id: 1, title: "Post One" }
 * // }
 */
export const deletePost = (req, res) => {
	const id = parseInt(req.params.id);
	const postIndex = posts.findIndex((p) => p.id === id);
	if (postIndex === -1) return res.status(404).json({ msg: "Post not found" });

	const post = posts[postIndex];
	posts.splice(postIndex, 1);
	res.status(200).json({ posts, deletedPost: post });
};
