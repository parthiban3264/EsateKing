import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { promisify } from "util";

const verifyToken = promisify(jwt.verify);

// GET: All posts with optional filters
export const getPosts = async (req, res) => {
    const query = req.query;
    console.log(query);

    try {
        const posts = await prisma.post.findMany({
            where: {
                city: query.city || undefined,
                type: query.type || undefined,
                property: query.property || undefined,
                betroom: parseInt(query.betroom) || undefined,
                bathroom: parseInt(query.bathroom) || undefined,
                price: {
                    gte: parseInt(query.minPrice) || 0,
                    lte: parseInt(query.maxPrice) || 100000000,
                },
            },
        });
            res.status(200).json(posts);

    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Failed to get Posts" });
    }
};

// GET: Single post with user and saved status
export const getPost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                postDetail: true,
                user: {
                    select: {
                        userName: true,
                        avatar: true,
                    },
                },
            },
        });

        let userId = null;
        const token = req.cookies?.token;

        if (token) {
            try {
                const payload = await verifyToken(token, process.env.JWT_SECRET_KEY);
                userId = payload.id;
            } catch (err) {
                console.log("Token invalid or expired");
            }
        }

        let saved = null;
        if (userId) {
            saved = await prisma.savedPost.findUnique({
                where: {
                    userId_postId: {
                        userId,
                        postId: id,
                    },
                },
            });
        }


        res.status(200).json({ ...post, isSaved: saved ? true : false });

    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Failed to get Post" });
    }
};

// POST: Add a new post
export const addPost = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;

    try {
        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                userId: tokenUserId,
                postDetail: {
                    create: body.postDetail,
                },
            },
        });

        res.status(201).json(newPost);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Failed to Add Post" });
    }
};

// PUT: Update a post
export const updatePost = async (req, res) => {
    const { id } = req.params;
    const tokenUserId = req.userId;
    const updates = req.body;

    try {
        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) return res.status(404).json({ Message: "Post not found" });
        if (post.userId !== tokenUserId) {
            return res.status(403).json({ Message: "Not Authorized" });
        }

        const updatedPost = await prisma.post.update({
            where: { id },
            data: updates,
        });

        res.status(200).json(updatedPost);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Failed to Update Post" });
    }
};

// DELETE: Delete a post
export const deletePost = async (req, res) => {
    const { id } = req.params;
    const tokenUserId = req.userId;

    try {
        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) return res.status(404).json({ Message: "Post not found" });
        if (post.userId !== tokenUserId) {
            return res.status(403).json({ Message: "Not Authorized" });
        }

        await prisma.post.delete({ where: { id } });
        res.status(200).json({ Message: "Post Deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Failed to Delete Post" });
    }
};
