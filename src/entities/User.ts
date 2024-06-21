import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Exercise } from "./Exercise";
import { v4 as uuidV4 } from "uuid";
import bcrypt from "bcrypt";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    username: string;
  
    @Column({ unique: true }) 
    email: string;
  
    @Column({ select: false }) 
    passwordHash: string;

    @OneToMany(() => Exercise, (exercise) => exercise.user)
    exercises: Exercise[];

    constructor() {
        if(!this.id){
            this.id = uuidV4();
        }
    }

    async setPassword(password: string) {
        this.passwordHash = await bcrypt.hash(password, 10);
    }
    
    async verifyPassword(password: string): Promise<boolean> {
        const passwordMatch: boolean = await bcrypt.compare(password, this.passwordHash);
        return passwordMatch; 
    }
}
