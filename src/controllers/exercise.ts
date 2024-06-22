import { Request, Response } from "express";
import { AppDataSource } from "../index";
import { Exercise } from "../entities/Exercise";
import { User } from "../entities/User";
import { Between, Like } from "typeorm";


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

// Get all exercises for the authenticated user
export const getAllExercises = async (req: Request, res: Response) => {
  try {
   
    const { title, description, dateStart, dateEnd, duration, tag } = req.query;
    
    if (dateStart && dateEnd) {
      const startDate = new Date(dateStart as string);
      const endDate = new Date(dateEnd as string);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).send("Invalid date format. Please use YYYY-MM-DD.");
      }

      if (startDate > endDate) {
        return res.status(400).send("Invalid date range. Start date cannot be after end date.");
      }
    }

    // Build the query conditions based on the filters
    const whereConditions: any = { user: req.user };
    if (title){
      whereConditions.title = Like(`%${title}%`);
    } 
  
    if (description){
      whereConditions.description = Like(`%${description}%`);
    }

    if (dateStart && dateEnd){
      whereConditions.date = Between(dateStart, dateEnd);
    }
    if (duration){
      whereConditions.duration = duration;
    } 
    if (tag){
      whereConditions.tag = tag;
    } 

    const exerciseRepository = AppDataSource.getRepository(Exercise);
    const exercises = await exerciseRepository.find({ where: whereConditions });

    res.status(200).send(exercises);
  } catch (error) {
    res.status(500).send("Error getting exercises: " + error);
  }
};

// Get a exercise by id for the authenticated user
export const getExerciseById = async (req: Request, res: Response) => {
  try {
   
    const exerciseId = req.params.id;

    const exerciseRepository = AppDataSource.getRepository(Exercise);
    const exercise = await exerciseRepository.findOne({
      where: { id: exerciseId, user: req.user },
    });

    if (!exercise) {
      return res.status(404).send("Exercise not found.");
    }

    res.status(200).send(exercise);
  } catch (error) {
    res.status(500).send("Error getting exercise: " + error.message);
  }
};
