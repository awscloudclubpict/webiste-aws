// Open routes no authentication:

import express from "express";
import BlogController, { upload } from "../controllers/blogController.js";

const router = express.Router();

// Create a new blog (no auth for testing)
router.post("/create", upload.single("thumbnail_image_url"), (req, res) =>
  BlogController.createBlog(req, res)
);

// Get all blogs (no auth)
router.get("/", (req, res) =>
  BlogController.getAllBlogs(req, res)
);

// Get a single blog by blog_id
router.get("/:id", (req, res) =>
  BlogController.getBlogById(req, res)
);

// Get blogs by tag
router.get("/tag/:tag", (req, res) =>
  BlogController.getBlogsByTag(req, res)
);

// Delete a blog
router.delete("/:id", (req, res) =>
  BlogController.deleteBlog(req, res)
);

export default router;