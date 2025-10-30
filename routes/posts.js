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
