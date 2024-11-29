import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Photo } from './photo.entity';
import { Vote } from './vote.entity';
import { Event } from './event.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['google', 'meta', 'local'],
    default: 'local'
  })
  authProvider: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Event, (event) => event.creator)
  events: Event[];

  @OneToMany(() => Photo, photo => photo.user)
  photos: Photo[];

  @OneToMany(() => Vote, vote => vote.user)
  votes: Vote[];
}
