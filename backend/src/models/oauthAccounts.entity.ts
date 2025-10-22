import { Entity, Unique, Index, BaseEntity, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('oauth_accounts')
@Unique(['provider', 'providerUserId'])
@Unique(['userId', 'provider'])
@Index(['provider', 'providerUserId'])
export class OAuthAccount extends BaseEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  @Index()
  userId: string;

  @Column({ type: 'varchar', length: 50 })
  provider: 'google' | 'apple';

  @Column({ type: 'varchar', length: 255, name: 'provider_user_id' })
  providerUserId: string;

  @Column({ type: 'text', nullable: true, name: 'access_token' })
  accessToken?: string;

  @Column({ type: 'text', nullable: true, name: 'refresh_token' })
  refreshToken?: string;

  @Column({ type: 'timestamp', nullable: true, name: 'token_expires_at' })
  tokenExpiresAt?: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.oauthAccounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}