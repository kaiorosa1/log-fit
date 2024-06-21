import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User"; 
import { v4 as uuidV4 } from "uuid";

@Entity("exercises")
export class Exercise {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column()
    title: string;

    @Column("text")
    description: string;

    @Column("date")
    date: Date;

    @Column()
    duration: number;

    @Column()
    tag: string;

    @ManyToOne(() => User, (user) => user.exercises)
    user: User;
   
    constructor() {
        if(!this.id){
            this.id = uuidV4();
        }
    }
}
