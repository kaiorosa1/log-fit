import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"; 
import { AppDataSource } from "../index"; 
import { User } from "../entities/User";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).send("Unauthorized - Missing Token");
    }

    const decoded = jwt.verify(token, "your_jwt_secret") as { userId: string }; 

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: decoded.userId });

    if (!user) {
      return res.status(401).send("Unauthorized - User Not Found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized - Invalid Token");
  }
};
