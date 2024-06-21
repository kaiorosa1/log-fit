import { Request, Response } from "express";
import { AppDataSource } from "../index";
import { User } from "../entities/User";
import jwt from "jsonwebtoken";

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOneBy({ username, email });

    if (existingUser) {
      return res.status(409).send("Username or email already exists");
    }

    const user = new User();
    user.username = username;
    user.email = email;
    await user.setPassword(password);

    await userRepository.save(user);
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(500).send("Error creating user");
  }
};

// Login a user
export const login = async (req: Request, res: Response) => {
    try {
      const { login, password } = req.body;
      
      const userRepository = AppDataSource.getRepository(User);
  
      const user = await userRepository
        .createQueryBuilder("user")
        .addSelect("user.passwordHash")
        .where("user.username = :login OR user.email = :login", { login })
        .getOne(); 

      const isPasswordValid = await user.verifyPassword(password);

      if (!user || !isPasswordValid) {
        return res.status(401).send("Invalid credentials");
      }
      console.log("my user", user);
      const token = jwt.sign(
        { userId: user.id },
        "your_jwt_secret", 
        { expiresIn: "1h" }
      );
      
      res.send({ token });
    } catch (error) {
      res.status(500).send("Error logging in");
    }
  };

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
    if (req.user) {
      res.send(req.user);
    } else {
      res.status(401).send("Unauthorized"); 
    }
};
