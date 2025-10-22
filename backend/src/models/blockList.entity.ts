import { Entity, Unique, BaseEntity, Column, Index, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseTimestampEntity } from "./abstractEntities";
import { User } from "./user.entity";
import { FocusSessionBlock } from "./focusSessionBlock.entity";

@Entity('block_lists')
@Unique(['userId', 'listName'])
export class BlockList extends BaseEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  @Index()
  userId: string;

  @Column({ type: 'varchar', length: 255, name: 'list_name' })
  listName: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: false, name: 'is_default' })
  isDefault: boolean;

  // Relations
  @ManyToOne(() => User, (user) => user.blockLists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => BlockListApp, (app) => app.blockList)
  apps: BlockListApp[];

  @OneToMany(() => FocusSessionBlock, (sessionBlock) => sessionBlock.blockList)
  focusSessionBlocks: FocusSessionBlock[];
}

@Entity('block_list_apps')
@Unique(['blockListId', 'osType', 'appIdentifier'])
export class BlockListApp extends BaseTimestampEntity {
  @Column({ type: 'uuid', name: 'block_list_id' })
  blockListId: string;

  @Column({ type: 'varchar', length: 20, name: 'os_type' })
  @Index()
  osType: 'ios' | 'android';

  @Column({ type: 'varchar', length: 255, name: 'app_name' })
  appName: string;

  @Column({ type: 'varchar', length: 255, name: 'app_identifier' })
  appIdentifier: string;

  @Column({ type: 'text', nullable: true, name: 'icon_url' })
  iconUrl?: string;

  @Column({ type: 'timestamp', name: 'added_at', default: () => 'CURRENT_TIMESTAMP' })
  addedAt: Date;

  // Relations
  @ManyToOne(() => BlockList, (blockList) => blockList.apps, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'block_list_id' })
  blockList: BlockList;
}