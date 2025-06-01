import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                userName,
                email,
                password: hashedPassword,
            },
        });
        console.log(newUser);
        res.status(201).json({ message: "User Created Successfully" });
    } catch (err) {
        if (err.code === 'P2002') {
            // Prisma unique constraint error
            return res.status(409).json({
                message: "Username or Email already exists!",
            });
        }

        console.error(err); // Log unexpected error
        res.status(500).json({ message: "Failed to Create User!" });
    }
};

export const login = async (req, res) => {
  const { userName, password } = req.body;
  console.log("Request Body:", req.body);

  if (!userName || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { userName },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials!" });
    }

    const age = 1000 * 60 * 60 * 24 * 7;
    const token = jwt.sign(
      { 
        id: user.id,
         isAdmin: false,
      }, 
      process.env.JWT_SECRET_KEY, {
      expiresIn: age,
    });

    const { password: userPassword, ...userInfo} = user;

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: age,
    }).status(200).json(userInfo);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login Failed!" });
  }
};

export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logout SucessFul." });
};