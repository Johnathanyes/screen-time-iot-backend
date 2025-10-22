import { Entity, Unique, Index, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { BaseTimestampEntity } from "./abstractEntities";
import { User } from "./user.entity";
import { DeviceChallenge } from "./deviceChallenge.entity";
import { DeviceSession } from "./deviceSession.entity";
import { DailyScreenTime } from "./dailyScreenTime.entity";
import { FocusSession } from "./focusSession.entity";

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  @Index()
  userId: string;

  @Column({ type: 'varchar', length: 255, name: 'device_name' })
  deviceName: string;

  @Column({ type: 'varchar', length: 20, name: 'os_type' })
  osType: 'ios' | 'android';

  @Column({ type: 'varchar', length: 255, unique: true, name: 'device_identifier' })
  deviceIdentifier: string;

  // SECURITY FIELDS
  @Column({ type: 'text', nullable: true, name: 'device_public_key' })
  devicePublicKey?: string; // Ed25519 public key from STM32

  @Column({ type: 'text', nullable: true, name: 'pairing_secret_hash' })
  pairingSecretHash?: string; // Argon2id hash

  @Column({ type: 'varchar', length: 64, nullable: true, name: 'pairing_nonce' })
  pairingNonce?: string; // Random nonce for initial pairing tap

  @Column({ type: 'timestamp', nullable: true, name: 'pairing_nonce_expires_at' })
  pairingNonceExpiresAt?: Date;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'pairing_state' })
  pairingState?: 'awaiting_tap' | 'tap_detected' | 'paired'; // Track pairing flow

  @Column({ type: 'boolean', default: false, name: 'is_paired' })
  isPaired: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'paired_at' })
  pairedAt?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'last_challenge_at' })
  lastChallengeAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => DeviceChallenge, (challenge) => challenge.device)
  challenges: DeviceChallenge[];

  @OneToMany(() => DeviceSession, (session) => session.device)
  sessions: DeviceSession[];

  @OneToMany(() => DailyScreenTime, (screenTime) => screenTime.device)
  dailyScreenTimes: DailyScreenTime[];

  @OneToMany(() => FocusSession, (session) => session.device)
  focusSessions: FocusSession[];

  // Helper methods
  isPairingNonceValid(): boolean {
    if (!this.pairingNonce || !this.pairingNonceExpiresAt) return false;
    return new Date() < this.pairingNonceExpiresAt;
  }

  isAwaitingPairing(): boolean {
    return this.pairingState === 'awaiting_tap' && this.isPairingNonceValid();
  }

  hasValidSession(): boolean {
    return this.isPaired && !!this.devicePublicKey;
  }
}