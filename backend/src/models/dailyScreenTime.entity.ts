import {
  Entity,
  Unique,
  Index,
  BaseEntity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Device } from "./devices.entity";
import { User } from "./user.entity";
import { AppUsage } from "./appUsage.entity";

@Entity("daily_screen_time")
@Unique(["userId", "deviceId", "date"])
@Index(["userId", "date"])
@Index(["deviceId", "date"])
export class DailyScreenTime extends BaseEntity {
  @Column({ type: "uuid", name: "user_id" })
  userId: string;

  @Column({ type: "uuid", name: "device_id" })
  @Index()
  deviceId: string;

  @Column({ type: "date" })
  date: Date;

  @Column({
    type: "integer",
    default: 0,
    name: "total_screen_time_minutes",
  })
  totalScreenTimeMinutes: number;

  @Column({ type: "integer", default: 0, name: "pickups_count" })
  pickupsCount: number;

  @Column({ type: "integer", default: 0, name: "notifications_count" })
  notificationsCount: number;

  // Relations
  @ManyToOne(() => User, (user) => user.dailyScreenTimes, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Device, (device) => device.dailyScreenTimes, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "device_id" })
  device: Device;

  @OneToMany(() => AppUsage, (appUsage) => appUsage.dailyScreenTime)
  appUsages: AppUsage[];
}
