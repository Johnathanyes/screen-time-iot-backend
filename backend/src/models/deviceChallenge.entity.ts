import { Entity, Index, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Device } from "./devices.entity";

@Entity('device_challenges')
@Index(['deviceId'])
@Index(['expiresAt'])
@Index(['challengeNonce'])
export class DeviceChallenge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'device_id' })
  deviceId: string;

  @Column({ type: 'varchar', length: 64, unique: true, name: 'challenge_nonce' })
  challengeNonce: string;

  @Column({ type: 'text', name: 'expected_response_hash' })
  expectedResponseHash: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'used_at' })
  usedAt?: Date;

  @Column({ type: 'boolean', default: false, name: 'is_valid' })
  isValid: boolean;

  // Relations
  @ManyToOne(() => Device, (device) => device.challenges, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'device_id' })
  device: Device;

  // Helper methods
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isUsed(): boolean {
    return !!this.usedAt;
  }

  canBeUsed(): boolean {
    return !this.isExpired() && !this.isUsed();
  }
}