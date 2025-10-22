import { Entity, BaseEntity, Column, OneToMany } from "typeorm";
import { OAuthAccount } from "./oauthAccounts.entity";
import { Device } from "./devices.entity";
import { DailyScreenTime } from "./dailyScreenTime.entity";
import { FocusSession } from "./focusSession.entity";
import { BlockList } from "./blockList.entity";

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  username?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'full_name' })
  fullName?: string;

  @Column({ type: 'text', nullable: true, name: 'profile_picture_url' })
  profilePictureUrl?: string;

  // Relations
  @OneToMany(() => OAuthAccount, (account) => account.user)
  oauthAccounts: OAuthAccount[];

  @OneToMany(() => Device, (device) => device.user)
  devices: Device[];

  @OneToMany(() => DailyScreenTime, (screenTime) => screenTime.user)
  dailyScreenTimes: DailyScreenTime[];

  @OneToMany(() => FocusSession, (session) => session.user)
  focusSessions: FocusSession[];

  @OneToMany(() => BlockList, (blockList) => blockList.user)
  blockLists: BlockList[];
}