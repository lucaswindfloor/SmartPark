import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  type: number;

  @Column()
  status: number;

  @Column()
  visibility: number;

  @Column({ default: 0 })
  needConfirm: boolean;

  @Column({ default: 0 })
  isTop: boolean;

  @Column({ nullable: true })
  topExpireTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  createdBy: number;

  @Column({ nullable: true })
  updatedBy: number;

  @Column({ nullable: true })
  publishedAt: Date;

  @Column({ nullable: true })
  publishedBy: number;
} 