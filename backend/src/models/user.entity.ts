import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  profilePictureUrl: string;

  @Column({ default: Date.now() })
  created_at: Date

  @Column({ default: Date.now() })
  updated_at: Date
}