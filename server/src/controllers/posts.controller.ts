import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";

const createPost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { content, category } = req.body;
    const userId = req.userId!;

    if (!content || !category) {
      return res
        .status(400)
        .json({ message: "content and category are required" });
    }

    const post = await prisma.post.create({
      data: { content, category, userId },
      select: {
        id: true,
        content: true,
        category: true,
        createdAt: true,
      },
    });

    return res.status(201).json({ message: "Post created", post });
  } catch (error) {
    console.log("POST CREATION ERROR", error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

const getPosts = async (_: Request, res: Response): Promise<Response> => {
  try {
    const posts = await prisma.post.findMany();

    return res.status(200).json(posts);
  } catch (error) {
    console.log("ERROR GETTING POSTS", error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const PostsController = {
  createPost,
  getPosts
};
