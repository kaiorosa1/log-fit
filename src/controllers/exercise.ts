import { Request, Response } from "express";
import { AppDataSource } from "../index";
import { Exercise } from "../entities/Exercise";
import { User } from "../entities/User";


// Create a new exercise for the authenticated user
export const createExercise = async (req: Request, res: Response) => {
  try {

    const { title, description, date, duration, tag } = req.body;

    const exerciseRepository = AppDataSource.getRepository(Exercise);
    const userRepository = AppDataSource.getRepository(User);
  
    const user = await userRepository
        .createQueryBuilder("user")
        .addSelect("user.passwordHash")
        .where("user.id = :id", { id: req.user.id })
        .getOne(); 

    const exercise = new Exercise();
    exercise.title = title;
    exercise.description = description;
    exercise.date = date;
    exercise.duration = duration;
    exercise.tag = tag;
    exercise.user = user;
    await exerciseRepository.save(exercise);

    const exerciseWithoutUser = {
        id: exercise.id,
        title: exercise.title,
        description: exercise.description,
        date: exercise.date,
        duration: exercise.duration,
        tag: exercise.tag
    };
    
    res.status(201).send(exerciseWithoutUser); 
  } catch (error) {
    res.status(500).send("Error creating exercise: " + error);
  }
};

