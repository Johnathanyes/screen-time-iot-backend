import { Entity, Unique, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseTimestampEntity } from "./abstractEntities";
import { BlockList } from "./blockList.entity";
import { FocusSession } from "./focusSession.entity";

@Entity('focus_session_blocks')
@Unique(['focusSessionId', 'blockListId'])
export class FocusSessionBlock extends BaseTimestampEntity {
  @Column({ type: 'uuid', name: 'focus_session_id' })
  focusSessionId: string;

  @Column({ type: 'uuid', name: 'block_list_id' })
  blockListId: string;

  // Relations
  @ManyToOne(() => FocusSession, (session) => session.focusSessionBlocks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'focus_session_id' })
  focusSession: FocusSession;

  @ManyToOne(() => BlockList, (blockList) => blockList.focusSessionBlocks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'block_list_id' })
  blockList: BlockList;
}