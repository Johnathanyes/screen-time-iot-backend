import { Entity, Index, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseTimestampEntity } from "./abstractEntities";
import { Device } from "./devices.entity";
import { User } from "./user.entity";
import { FocusSessionBlock } from "./focusSessionBlock.entity";
import { SessionInterruption } from "./sessionInterruption.entity";

export type FocusSessionStatus = 'active' | 'completed' | 'cancelled' | 'paused';

@Entity('focus_sessions')
@Index(['userId', 'status'])
@Index(['startTime'])
export class FocusSession extends BaseTimestampEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', nullable: true, name: 'device_id' })
  deviceId?: string;

  @Column({ type: 'varchar', length: 255, name: 'session_name' })
  sessionName: string;

  @Column({ type: 'timestamp', name: 'start_time' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'end_time' })
  endTime?: Date;

  @Column({ type: 'integer', name: 'planned_duration_minutes' })
  plannedDurationMinutes: number;

  @Column({ type: 'integer', nullable: true, name: 'actual_duration_minutes' })
  actualDurationMinutes?: number;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'active',
  })
  status: FocusSessionStatus;

  @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
  completedAt?: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.focusSessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Device, (device) => device.focusSessions, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'device_id' })
  device?: Device;

  @OneToMany(
    () => FocusSessionBlock,
    (sessionBlock) => sessionBlock.focusSession
  )
  focusSessionBlocks: FocusSessionBlock[];

  @OneToMany(
    () => SessionInterruption,
    (interruption) => interruption.focusSession
  )
  interruptions: SessionInterruption[];

  // Helper methods
  isActive(): boolean {
    return this.status === 'active';
  }

  isCompleted(): boolean {
    return this.status === 'completed';
  }

  complete(): void {
    this.status = 'completed';
    this.completedAt = new Date();
    this.endTime = new Date();
    this.actualDurationMinutes = Math.floor(
      (this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60)
    );
  }

  cancel(): void {
    this.status = 'cancelled';
    this.endTime = new Date();
  }

  pause(): void {
    this.status = 'paused';
  }

  getSuccessRate(): number | null {
    if (!this.actualDurationMinutes || !this.plannedDurationMinutes) return null;
    return (this.actualDurationMinutes / this.plannedDurationMinutes) * 100;
  }
}