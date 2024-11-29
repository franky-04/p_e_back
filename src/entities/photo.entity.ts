import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';
import { Vote } from './vote.entity';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filePath: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  votesCount: number;

  @CreateDateColumn()
  uploadedAt: Date;

  @ManyToOne(() => Event, (event) => event.photos)
  event: Event;

  @ManyToOne(() => User, (user) => user.photos)
  user: User;

  @OneToMany(() => Vote, (vote) => vote.photo)
  votes: Vote[];
}
