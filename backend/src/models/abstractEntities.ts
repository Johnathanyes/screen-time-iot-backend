import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Index,
    Unique,
  } from 'typeorm';
export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}

/**
 * Base entity with simple timestamp (no update tracking)
 */
export abstract class BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

/**
 * Platform-specific entity for handling iOS/Android differences
 */
export abstract class PlatformSpecificEntity extends BaseTimestampEntity {
    @Column({
      type: 'varchar',
      length: 20,
      name: 'os_type',
    })
    @Index()
    osType: 'ios' | 'android';
  }