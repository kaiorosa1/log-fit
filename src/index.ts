import "reflect-metadata";
import express from "express";
import { DataSource} from "typeorm";
import exerciseRoutes from "./routes/exercise";
import userRoutes from "./routes/user";
import * as dotenv from "dotenv";


const app = express();
app.use(express.json());

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT!, 10), 
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: [process.env.TYPEORM_ENTITIES!],
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true'
});

AppDataSource.initialize()
  .then(() => {
    app.use("/exercises", exerciseRoutes); 
    app.use("/users", userRoutes);
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => console.log("Error during Data Source initialization:", error));