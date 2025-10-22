import { Entity, Column, Index, ManyToOne, JoinColumn } from "typeorm";
import { BaseTimestampEntity } from "./abstractEntities";
import { FocusSession } from "./focusSession.entity";

@Entity('session_interruptions')
export class SessionInterruption extends BaseTimestampEntity {
  @Column({ type: 'uuid', name: 'focus_session_id' })
  @Index()
  focusSessionId: string;

  @Column({ type: 'varchar', length: 20, name: 'os_type' })
  osType: 'ios' | 'android';

  @Column({ type: 'varchar', length: 255, name: 'app_name' })
  appName: string;

  @Column({ type: 'varchar', length: 255, name: 'app_identifier' })
  appIdentifier: string;

  @Column({ type: 'timestamp', name: 'attempted_at', default: () => 'CURRENT_TIMESTAMP' })
  attemptedAt: Date;

  @Column({ type: 'boolean', default: false, name: 'was_allowed' })
  wasAllowed: boolean;

  // Relations
  @ManyToOne(() => FocusSession, (session) => session.interruptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'focus_session_id' })
  focusSession: FocusSession;
}
