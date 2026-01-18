import type { Selectable, Insertable } from 'kysely';
import type { ColumnType } from 'kysely';

// 训练数据窗口表（每个400ms窗口一行）
export type TrainingWindowTable = {
  id: ColumnType<bigint, never, never>;
  match_checksum: string;
  round_number: number;
  player_steam_id: string;
  player_name: string;
  window_idx: number;
  start_tick: number;
  end_tick: number;
  time_ms: number;

  // 玩家状态
  pos_x: number;
  pos_y: number;
  pos_z: number;
  view_pitch: number;
  view_yaw: number;
  health: number;
  armor: number;
  weapon: string;
  is_alive: boolean;
  is_scoped: boolean;
  is_crouching: boolean;
  is_defusing: boolean;
  is_planting: boolean;
  flash_duration: number;
  team: string;
  money: number;

  // 移动状态
  is_moving: boolean;
  move_direction: string;
  move_speed: number;

  // 情况描述（中文）
  situation_text: string;

  // 事件摘要（JSON数组）
  events_json: string;
  events_zh: string; // 中文事件描述，逗号分隔

  // 帧路径
  start_frame_path: string;
  middle_frame_paths: string; // JSON数组
  end_frame_path: string;
};

export type TrainingWindowRow = Selectable<TrainingWindowTable>;
export type InsertableTrainingWindowRow = Insertable<TrainingWindowTable>;
