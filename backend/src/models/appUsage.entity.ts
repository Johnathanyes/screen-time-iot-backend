import { Entity, Unique, Column, Index, ManyToOne, JoinColumn } from "typeorm";
import { PlatformSpecificEntity } from "./abstractEntities";
import { DailyScreenTime } from "./dailyScreenTime.entity";

@Entity("app_usage")
@Unique(["dailyScreenTimeId", "appIdentifier"])
export class AppUsage extends PlatformSpecificEntity {
  @Column({ type: "uuid", name: "daily_screen_time_id" })
  @Index()
  dailyScreenTimeId: string;

  @Column({ type: "varchar", length: 255, name: "app_name" })
  appName: string;

  @Column({ type: "varchar", length: 255, name: "app_identifier" })
  appIdentifier: string;

  @Column({ type: "integer", default: 0, name: "usage_minutes" })
  usageMinutes: number;

  @Column({ type: "integer", default: 0, name: "opens_count" })
  opensCount: number;

  @Column({ type: "integer", default: 0, name: "notifications_count" })
  notificationsCount: number;

  // iOS specific
  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
    name: "ios_category",
  })
  iosCategory?: string;

  // Android specific
  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
    name: "android_app_category",
  })
  androidAppCategory?: string;

  // Relations
  @ManyToOne(() => DailyScreenTime, (screenTime) => screenTime.appUsages, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "daily_screen_time_id" })
  dailyScreenTime: DailyScreenTime;

  // Helper methods
  getCategory(): string | undefined {
    return this.osType === "ios" ? this.iosCategory : this.androidAppCategory;
  }

  getUsageHours(): number {
    return this.usageMinutes / 60;
  }
}
