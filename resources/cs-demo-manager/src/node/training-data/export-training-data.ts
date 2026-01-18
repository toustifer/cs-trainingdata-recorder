import fs from 'node:fs/promises';
import path from 'node:path';
import { fetchMatchPlayers } from 'csdm/node/database/match-players/fetch-match-players';
import { fetchSinglePlayerPositions } from 'csdm/node/database/player-position/fetch-players-positions';
import { fetchRounds } from 'csdm/node/database/rounds/fetch-rounds';
import { fetchKills } from 'csdm/node/database/kills/fetch-kills';
import { fetchDamages } from 'csdm/node/database/damages/fetch-damages';
import { fetchPlayerBlinds } from 'csdm/node/database/player-blinds/fetch-player-blinds';
import { fetchShots } from 'csdm/node/database/shots/fetch-shots';
import { fetchPlayerShots } from 'csdm/node/database/shots/fetch-player-shots';
import type { Round } from 'csdm/common/types/round';
import {
  insertTrainingWindows,
  deleteTrainingDataByChecksum,
} from 'csdm/node/database/training-windows/insert-training-windows';
import type { InsertableTrainingWindowRow } from 'csdm/node/database/training-windows/training-window-table';

// 400ms 时间窗口，内含10帧（25fps）
const WINDOW_MS = 400;
const FRAMES_PER_WINDOW = 10;

// 内存监控辅助函数
function formatMemory(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

function logMemory(label: string) {
  const used = process.memoryUsage();
  console.log(
    `  [内存 ${label}] 堆: ${formatMemory(used.heapUsed)}/${formatMemory(used.heapTotal)}, 总: ${formatMemory(used.rss)}`,
  );
}

function tryGC() {
  if (global.gc) {
    global.gc();
  }
}

export type TrainingDataOptions = {
  checksum: string;
  demoPath: string;
  outputFolderPath: string;
  tickrate: number;
  windowMs?: number;
  framesPerWindow?: number;
  playerSteamIds?: string[]; // 如果不指定，处理所有玩家
  roundNumbers?: number[]; // 如果不指定，处理所有回合
  framesDir?: string; // 视频帧目录
};

export type PlayerState = {
  position: { x: number; y: number; z: number };
  view: { pitch: number; yaw: number };
  health: number;
  armor: number;
  weapon: string;
  isAlive: boolean;
  isScoped: boolean;
  isCrouching: boolean;
  isDefusing: boolean;
  isPlanting: boolean;
  flashDuration: number;
  team: string;
  money: number;
};

export type MovementInfo = {
  moving: boolean;
  direction: string;
  speed: number;
};

export type EventInfo = {
  tick: number;
  type: string;
  description: string;
  raw: Record<string, unknown>;
};

/**
 * 武器名中文映射
 */
const WEAPON_CN: Record<string, string> = {
  ak47: 'AK-47', m4a1: 'M4A1', m4a1_silencer: 'M4A1消音',
  awp: 'AWP', deagle: '沙漠之鹰', glock: '格洛克',
  usp_silencer: 'USP消音', knife: '刀', c4: 'C4',
  flashbang: '闪光弹', smokegrenade: '烟雾弹',
  hegrenade: '高爆手雷', molotov: '燃烧瓶', incgrenade: '燃烧弹',
  p250: 'P250', fiveseven: '57', tec9: 'TEC-9',
  cz75a: 'CZ75', elite: '双枪', p2000: 'P2000',
  mp9: 'MP9', mac10: 'MAC-10', mp7: 'MP7', mp5sd: 'MP5',
  ump45: 'UMP-45', p90: 'P90', bizon: 'PP野牛',
  famas: 'FAMAS', galilar: '加利尔', sg556: 'SG553',
  aug: 'AUG', ssg08: '连狙', g3sg1: 'G3SG1', scar20: 'SCAR-20',
  nova: 'NOVA', xm1014: 'XM1014', mag7: 'MAG-7', sawedoff: '短管',
  m249: 'M249', negev: 'NEGEV',
};

function weaponToCn(weapon: string): string {
  if (!weapon) return '';
  const w = weapon.replace('weapon_', '');
  return WEAPON_CN[w] || w;
}

/**
 * 从速度向量推断移动方向（WASD）
 */
function inferMovement(vx: number, vy: number, yaw: number): MovementInfo {
  const speed = Math.sqrt(vx * vx + vy * vy);

  if (speed < 10) {
    return { moving: false, direction: '静止', speed: 0 };
  }

  const moveAngle = (Math.atan2(vy, vx) * 180) / Math.PI;
  const relativeAngle = ((moveAngle - yaw + 360) % 360);

  let direction: string;
  if (relativeAngle >= 315 || relativeAngle < 45) {
    direction = '前进(W)';
  } else if (relativeAngle >= 45 && relativeAngle < 135) {
    direction = '左移(A)';
  } else if (relativeAngle >= 135 && relativeAngle < 225) {
    direction = '后退(S)';
  } else {
    direction = '右移(D)';
  }

  return { moving: true, direction, speed: Math.round(speed * 10) / 10 };
}

/**
 * 生成 situation 描述
 */
function buildSituationText(state: PlayerState, movement: MovementInfo): string {
  const parts: string[] = [];

  parts.push(`HP:${state.health}`);
  if (state.armor > 0) parts.push(`护甲:${state.armor}`);
  if (state.weapon) parts.push(`武器:${state.weapon}`);
  if (state.isScoped) parts.push('开镜中');
  if (state.isCrouching) parts.push('蹲下');
  if (state.isDefusing) parts.push('拆弹中');
  if (state.isPlanting) parts.push('装弹中');
  if (state.flashDuration > 0) parts.push(`闪盲中(${state.flashDuration.toFixed(1)}s)`);
  parts.push(movement.direction);
  if (movement.moving) parts.push(`速度:${movement.speed}`);

  return parts.join(' | ');
}

/**
 * 生成帧路径
 */
function generateFramePaths(
  windowIdx: number,
  framesPerWindow: number,
  framesDir: string,
): { startFramePath: string; middleFramePaths: string[]; endFramePath: string } {
  const baseFrameIdx = windowIdx * framesPerWindow;
  const formatFramePath = (idx: number) => path.join(framesDir, `frame_${String(idx + 1).padStart(4, '0')}.jpg`);

  const startFramePath = formatFramePath(baseFrameIdx);
  const endFramePath = formatFramePath(baseFrameIdx + framesPerWindow - 1);

  const middleFramePaths: string[] = [];
  for (let i = 1; i < framesPerWindow - 1; i++) {
    middleFramePaths.push(formatFramePath(baseFrameIdx + i));
  }

  return { startFramePath, middleFramePaths, endFramePath };
}

/**
 * 默认状态
 */
function getDefaultState(): PlayerState {
  return {
    position: { x: 0, y: 0, z: 0 },
    view: { pitch: 0, yaw: 0 },
    health: 100,
    armor: 0,
    weapon: '',
    isAlive: true,
    isScoped: false,
    isCrouching: false,
    isDefusing: false,
    isPlanting: false,
    flashDuration: 0,
    team: '',
    money: 0,
  };
}

/**
 * 导出单个玩家单个回合的训练数据（流式写入数据库，返回窗口数量）
 */
export async function exportPlayerRoundTrainingData(
  options: TrainingDataOptions & {
    playerSteamId: string;
    playerName: string;
    round: Round;
    roundFramesDir: string;
  },
): Promise<number> {
  const { checksum, demoPath, tickrate, playerSteamId, playerName, round, roundFramesDir } = options;
  const windowMs = options.windowMs ?? WINDOW_MS;
  const framesPerWindow = options.framesPerWindow ?? FRAMES_PER_WINDOW;
  const ticksPerWindow = Math.ceil((windowMs * tickrate) / 1000);
  const videoFps = (framesPerWindow * 1000) / windowMs;

  console.log(`      配置: tickrate=${tickrate}, windowMs=${windowMs}, ticksPerWindow=${ticksPerWindow}`);

  const startTick = round.freezetimeEndTick;
  const endTick = round.endTick;

  console.log(`      获取事件数据...`);
  // 获取该玩家该回合的所有事件（只获取该玩家相关的）
  const [kills, damages, blinds, shots] = await Promise.all([
    fetchKills(checksum, round.number),
    fetchDamages(checksum, round.number),
    fetchPlayerBlinds(checksum, round.number),
    fetchPlayerShots(checksum, round.number, playerSteamId), // 只获取该玩家的shots
  ]);
  console.log(`      事件数: kills=${kills.length}, damages=${damages.length}, blinds=${blinds.length}, shots=${shots.length}`);

  // 筛选该玩家相关的事件
  const roundKills = kills.filter(
    (k) => k.killerSteamId === playerSteamId || k.victimSteamId === playerSteamId,
  );
  const roundDamages = damages.filter(
    (d) => d.attackerSteamId === playerSteamId || d.victimSteamId === playerSteamId,
  );
  const roundBlinds = blinds.filter(
    (b) => b.flasherSteamId === playerSteamId || b.flashedSteamId === playerSteamId,
  );
  // shots 已经是该玩家的了，不需要再过滤
  const roundShots = shots;

  // 获取位置数据（只获取该玩家的）
  console.log(`      获取位置数据...`);
  const allPositions: Map<number, PlayerState> = new Map();

  try {
    const positions = await fetchSinglePlayerPositions(checksum, round.number, playerSteamId);
    console.log(`      位置数: ${positions.length}`);

    for (const pos of positions) {
      allPositions.set(pos.tick, {
        position: { x: pos.x, y: pos.y, z: pos.z },
        view: { pitch: 0, yaw: pos.yaw },
        health: pos.health,
        armor: pos.armor,
        weapon: weaponToCn(pos.activeWeaponName),
        isAlive: pos.isAlive,
        isScoped: pos.isScoping,
        isCrouching: pos.isDucking,
        isDefusing: pos.isDefusing,
        isPlanting: pos.isPlanting,
        flashDuration: pos.flashDurationRemaining,
        team: pos.side === 2 ? 'T' : pos.side === 3 ? 'CT' : '',
        money: pos.money,
      });
    }
  } catch (e) {
    // 静默处理位置数据缺失
  }

  // 构建事件索引
  console.log(`      构建事件索引...`);
  const eventsByTick: Map<number, EventInfo[]> = new Map();

  const addEvent = (tick: number, event: EventInfo) => {
    if (!eventsByTick.has(tick)) {
      eventsByTick.set(tick, []);
    }
    eventsByTick.get(tick)!.push(event);
  };

  // 添加击杀事件
  for (const kill of roundKills) {
    const isKiller = kill.killerSteamId === playerSteamId;
    addEvent(kill.tick, {
      tick: kill.tick,
      type: isKiller ? 'kill' : 'death',
      description: isKiller ? `击杀 ${kill.victimName}` : `被 ${kill.killerName} 击杀`,
      raw: kill as unknown as Record<string, unknown>,
    });
  }

  // 添加伤害事件
  for (const dmg of roundDamages) {
    const isAttacker = dmg.attackerSteamId === playerSteamId;
    if (dmg.healthDamage > 0) {
      addEvent(dmg.tick, {
        tick: dmg.tick,
        type: isAttacker ? 'damage_dealt' : 'damage_taken',
        description: isAttacker
          ? `击中敌人 (-${dmg.healthDamage}HP)`
          : `被击中 (-${dmg.healthDamage}HP)`,
        raw: dmg as unknown as Record<string, unknown>,
      });
    }
  }

  // 添加闪盲事件
  for (const blind of roundBlinds) {
    const isFlasher = blind.flasherSteamId === playerSteamId;
    addEvent(blind.tick, {
      tick: blind.tick,
      type: isFlasher ? 'flash_enemy' : 'flashed',
      description: isFlasher
        ? `闪盲 ${blind.flashedName} (${blind.duration.toFixed(1)}s)`
        : `被 ${blind.flasherName} 闪盲 (${blind.duration.toFixed(1)}s)`,
      raw: blind as unknown as Record<string, unknown>,
    });
  }

  // 添加射击事件
  for (const shot of roundShots) {
    addEvent(shot.tick, {
      tick: shot.tick,
      type: 'shot',
      description: `开火 (${weaponToCn(shot.weaponName)})`,
      raw: shot as unknown as Record<string, unknown>,
    });
  }

  // 按窗口切分数据，并分批写入数据库（不要累积所有数据）
  console.log(`      开始处理窗口 (tick ${startTick} - ${endTick})...`);
  const BATCH_SIZE = 100; // 每100个窗口写入一次
  let dbRows: InsertableTrainingWindowRow[] = [];
  let currentTick = startTick;
  let windowIdx = 0;
  let totalWindows = 0;

  while (currentTick < endTick) {
    if (windowIdx % 50 === 0) {
      console.log(`      处理窗口 ${windowIdx}, tick ${currentTick}...`);
    }

    const windowEndTick = Math.min(currentTick + ticksPerWindow, endTick);

    // 获取起始帧之前的状态
    let situationState: PlayerState | undefined;
    for (let t = currentTick - 1; t >= currentTick - 10 && !situationState; t--) {
      situationState = allPositions.get(t);
    }
    if (!situationState) {
      situationState = getDefaultState();
    }

    // 推断移动方向
    const prevState = allPositions.get(currentTick - 2);
    let movement: MovementInfo = { moving: false, direction: '静止', speed: 0 };
    if (prevState && situationState) {
      const vx = (situationState.position.x - prevState.position.x) * tickrate;
      const vy = (situationState.position.y - prevState.position.y) * tickrate;
      movement = inferMovement(vx, vy, situationState.view.yaw);
    }

    // 收集该窗口内的事件
    const windowEvents: EventInfo[] = [];
    for (let t = currentTick; t < windowEndTick; t++) {
      const events = eventsByTick.get(t);
      if (events) {
        windowEvents.push(...events);
      }
    }

    // 生成帧路径
    const framePaths = generateFramePaths(windowIdx, framesPerWindow, roundFramesDir);

    // 转换为数据库行格式
    dbRows.push({
      match_checksum: checksum,
      round_number: round.number,
      player_steam_id: playerSteamId,
      player_name: playerName,
      window_idx: windowIdx,
      start_tick: currentTick,
      end_tick: windowEndTick,
      time_ms: windowIdx * windowMs,

      // 玩家状态
      pos_x: situationState.position.x,
      pos_y: situationState.position.y,
      pos_z: situationState.position.z,
      view_pitch: situationState.view.pitch,
      view_yaw: situationState.view.yaw,
      health: situationState.health,
      armor: situationState.armor,
      weapon: situationState.weapon,
      is_alive: situationState.isAlive,
      is_scoped: situationState.isScoped,
      is_crouching: situationState.isCrouching,
      is_defusing: situationState.isDefusing,
      is_planting: situationState.isPlanting,
      flash_duration: situationState.flashDuration,
      team: situationState.team,
      money: situationState.money,

      // 移动状态
      is_moving: movement.moving,
      move_direction: movement.direction,
      move_speed: movement.speed,

      // 情况描述
      situation_text: buildSituationText(situationState, movement),

      // 事件（JSON字符串）
      events_json: JSON.stringify(windowEvents),
      events_zh: windowEvents.map((e) => `[${e.tick}] ${e.description}`).join('; '),

      // 帧路径
      start_frame_path: framePaths.startFramePath,
      middle_frame_paths: JSON.stringify(framePaths.middleFramePaths),
      end_frame_path: framePaths.endFramePath,
    });

    // 分批写入数据库
    if (dbRows.length >= BATCH_SIZE) {
      console.log(`      写入批次 (${dbRows.length} 条)...`);
      await insertTrainingWindows(dbRows);
      totalWindows += dbRows.length;
      dbRows = []; // 清空数组释放内存
      tryGC(); // 尝试触发垃圾回收
      console.log(`      批次写入完成`);
    }

    currentTick = windowEndTick;
    windowIdx++;
  }

  // 写入剩余的数据
  console.log(`      写入剩余数据 (${dbRows.length} 条)...`);
  if (dbRows.length > 0) {
    await insertTrainingWindows(dbRows);
    totalWindows += dbRows.length;
  }
  console.log(`      完成！共 ${totalWindows} 个窗口`);

  return totalWindows;
}

/**
 * 导出整个demo的训练数据到数据库（流式处理，逐回合写入）
 */
export async function exportDemoTrainingData(options: TrainingDataOptions): Promise<void> {
  const { checksum, demoPath, outputFolderPath } = options;

  console.log(`  开始导出训练数据到数据库...`);
  logMemory('开始');

  console.log('[DEBUG] Step 1: Fetching match players (with retry)...');

  // 获取所有玩家（使用重试机制，因为 psql CLI 可能还在提交事务）
  let players = [];
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      console.log(`[DEBUG] Attempt ${attempt + 1}/3 to fetch players...`);
      players = await fetchMatchPlayers(checksum);
      if (players.length > 0) {
        console.log(`[DEBUG] ✓ Found ${players.length} players`);
        break;
      }
      if (attempt < 2) {
        console.log(`[DEBUG] ✗ No players found, retrying in 1.5s...`);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    } catch (error) {
      console.error(`[DEBUG] ✗ Error fetching players: ${error instanceof Error ? error.message : error}`);
      if (attempt < 2) {
        console.log(`[DEBUG] Retrying in 1.5s...`);
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
        throw error;
      }
    }
  }

  const playerSteamIds = options.playerSteamIds ?? players.map((p) => p.steamId);
  console.log(`[DEBUG] Target player IDs: ${playerSteamIds.join(', ')}`);

  console.log('[DEBUG] Step 2: Fetching rounds (with retry)...');

  // 获取所有回合（使用重试机制）
  let allRounds = [];
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      console.log(`[DEBUG] Attempt ${attempt + 1}/3 to fetch rounds...`);
      allRounds = await fetchRounds(checksum);
      if (allRounds.length > 0) {
        console.log(`[DEBUG] ✓ Found ${allRounds.length} rounds`);
        break;
      }
      if (attempt < 2) {
        console.log(`[DEBUG] ✗ No rounds found, retrying in 1.5s...`);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    } catch (error) {
      console.error(`[DEBUG] ✗ Error fetching rounds: ${error instanceof Error ? error.message : error}`);
      if (attempt < 2) {
        console.log(`[DEBUG] Retrying in 1.5s...`);
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
        throw error;
      }
    }
  }

  const rounds = options.roundNumbers
    ? allRounds.filter((r) => options.roundNumbers!.includes(r.number))
    : allRounds;

  console.log(`  找到 ${players.length} 个玩家, ${allRounds.length} 个回合`);
  console.log(`  导出 ${playerSteamIds.length} 个玩家, ${rounds.length} 个回合`);

  // 删除旧数据（如果有）
  await deleteTrainingDataByChecksum(checksum);
  console.log(`  已清除旧的训练数据`);

  let totalWindows = 0;
  let processedRounds = 0;

  // 逐玩家、逐回合处理
  for (const steamId of playerSteamIds) {
    const player = players.find((p) => p.steamId === steamId);
    if (!player) {
      console.log(`    玩家 ${steamId} 未找到，跳过`);
      continue;
    }

    console.log(`\n  玩家: ${player.name} (${steamId})`);
    logMemory(`玩家 ${player.name} 开始`);

    for (const round of rounds) {
      try {
        const roundFramesDir = options.framesDir
          ? path.join(options.framesDir, `round_${round.number}`)
          : path.join(outputFolderPath, `${player.name}_${steamId}`, `round_${round.number}`, 'frames');

        // 处理该玩家该回合的数据（直接写入数据库并返回数量）
        const windowsCount = await exportPlayerRoundTrainingData({
          ...options,
          playerSteamId: steamId,
          playerName: player.name,
          round,
          roundFramesDir,
        });

        totalWindows += windowsCount;
        processedRounds++;
        console.log(
          `    回合 ${round.number}: ${windowsCount} 个窗口, tick ${round.freezetimeEndTick}-${round.endTick}`,
        );

        // 每10个回合打印一次内存
        if (processedRounds % 10 === 0) {
          logMemory(`已处理 ${processedRounds} 回合`);
          tryGC(); // 尝试垃圾回收
        }
      } catch (error) {
        console.error(`    回合 ${round.number} 处理失败: ${error}`);
      }
    }

    logMemory(`玩家 ${player.name} 完成`);
  }

  logMemory('全部完成');
  console.log(`\n  导出完成！共 ${totalWindows} 个时间窗口写入数据库`);
}

// 兼容旧接口
export async function exportAllPlayersTrainingData(options: TrainingDataOptions): Promise<void> {
  await exportDemoTrainingData(options);
}
