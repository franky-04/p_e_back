import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Photo } from './photo.entity';

@Entity('votes')
@Unique(['user', 'photo'])
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Photo, (photo) => photo.votes)
  photo: Photo;

  @ManyToOne(() => User, (user) => user.votes)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
