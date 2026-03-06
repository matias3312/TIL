import type { Request, Response } from "express";
import type { LoginInput } from "../schemas/auth.schemas.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import type { RegisterInput } from "../schemas/auth.schemas.js";

const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body as RegisterInput;

    //Verificar si el email ya existe
    const emailExists = await prisma.user.findUnique({
      where: { email },
    });

    if (emailExists) {
      return res.status(409).json({
        errors: { email: ["Este email ya está registrado"] },
      });
    }

    //Verificar si username existe

    const usernameExists = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (usernameExists) {
      return res.status(409).json({
        errors: { username: ["Este nombre de usuario ya está en uso"] },
      });
    }

    //Hashear la contraseña

    const hashedPassword = await bcrypt.hash(password, 12);

    //Crear el usuario en la BD

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    //Generar JWT

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    //Responder con el usuario y el token

    return res.status(201).json({
      message: "Usuario creado correctamente",
      user,
      token,
    });
  } catch (error) {
    console.error("[REGISTER ERROR]", error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

export const AuthControllers = {
  register,
};
