import { describe, it, expect } from 'vitest';
import { buildPlayersEventSequences } from './build-players-event-sequences';
import { PlayerSequenceEvent } from 'csdm/common/types/player-sequence-event';
import { Perspective } from 'csdm/common/types/perspective';
import { defaultSettings } from 'csdm/node/settings/default-settings';
const baseMatch = {
    demoFilePath: '/demo/path',
    tickrate: 10, // Set the demo's tickrate to 10 for easier debugging
    tickCount: 100_000,
    players: [],
    kills: [],
};
const killerSteamId = 'killer-steamId';
const killer = {
    steamId: killerSteamId,
    name: 'Killer name',
};
describe('generate player kills sequences', () => {
    it('should generate 1 sequence if there is only 1 kill', () => {
        const kill = {
            killerSteamId,
            tick: 100,
        };
        const match = {
            ...baseMatch,
            players: [killer],
            kills: [kill],
        };
        const sequences = buildPlayersEventSequences({
            event: PlayerSequenceEvent.Kills,
            match,
            steamIds: [killerSteamId],
            rounds: [],
            perspective: Perspective.Player,
            weapons: [],
            settings: defaultSettings.video,
            startSecondsBeforeEvent: 5,
            endSecondsAfterEvent: 2,
            firstSequenceNumber: 1,
        });
        expect(sequences.length).toBe(1);
        const sequence = sequences[0];
        expect(sequence.number).toBe(1);
        expect(sequence.startTick).toBe(50);
        expect(sequence.endTick).toBe(120);
    });
    it('should generate a single sequence if next kills are too close to the first kill', () => {
        const firstKillWithDedicatedSequence = {
            killerSteamId,
            tick: 100,
        };
        const firstKill = {
            killerSteamId,
            tick: 3000,
        };
        const secondKill = {
            killerSteamId,
            tick: 3100, // Changing it to 3101 should result in a test failure
        };
        const thirdKill = {
            killerSteamId,
            tick: 3200, // Changing it to 3201 should result in a test failure
        };
        const lastKillWithDedicatedSequence = {
            killerSteamId,
            tick: 6000,
        };
        const match = {
            ...baseMatch,
            players: [killer],
            kills: [firstKillWithDedicatedSequence, firstKill, secondKill, thirdKill, lastKillWithDedicatedSequence],
        };
        const sequences = buildPlayersEventSequences({
            event: PlayerSequenceEvent.Kills,
            match,
            steamIds: [killerSteamId],
            rounds: [],
            perspective: Perspective.Player,
            weapons: [],
            settings: defaultSettings.video,
            startSecondsBeforeEvent: 5,
            endSecondsAfterEvent: 2,
            firstSequenceNumber: 1,
        });
        expect(sequences.length).toBe(3);
        const firstSequence = sequences[0];
        expect(firstSequence.number).toBe(1);
        expect(firstSequence.startTick).toBe(50);
        expect(firstSequence.endTick).toBe(120);
        const secondSequence = sequences[1];
        expect(secondSequence.number).toBe(2);
        expect(secondSequence.startTick).toBe(2950);
        expect(secondSequence.endTick).toBe(3220);
        const thirdSequence = sequences[2];
        expect(thirdSequence.number).toBe(3);
        expect(thirdSequence.startTick).toBe(5950);
        expect(thirdSequence.endTick).toBe(6020);
    });
    it('should generate a single sequence if kills occurred at the same tick', () => {
        const firstKill = {
            killerSteamId,
            tick: 100,
        };
        const secondKill = {
            killerSteamId,
            tick: 100,
        };
        const match = {
            ...baseMatch,
            players: [killer],
            kills: [firstKill, secondKill],
        };
        const sequences = buildPlayersEventSequences({
            event: PlayerSequenceEvent.Kills,
            match,
            steamIds: [killerSteamId],
            rounds: [],
            perspective: Perspective.Player,
            weapons: [],
            settings: defaultSettings.video,
            startSecondsBeforeEvent: 5,
            endSecondsAfterEvent: 2,
            firstSequenceNumber: 1,
        });
        expect(sequences.length).toBe(1);
        const killSequence = sequences[0];
        expect(killSequence.number).toBe(1);
        expect(killSequence.startTick).toBe(50);
        expect(killSequence.endTick).toBe(120);
    });
    it('should not overlap sequences', () => {
        const kill1 = {
            killerSteamId,
            tick: 100,
        };
        const kill2 = {
            killerSteamId,
            tick: 200, // Changing it to 201 should result in a test failure
        };
        const match = {
            ...baseMatch,
            players: [killer],
            kills: [kill1, kill2],
        };
        const sequences = buildPlayersEventSequences({
            event: PlayerSequenceEvent.Kills,
            match,
            steamIds: [killerSteamId],
            rounds: [],
            perspective: Perspective.Player,
            weapons: [],
            settings: defaultSettings.video,
            startSecondsBeforeEvent: 5,
            endSecondsAfterEvent: 2,
            firstSequenceNumber: 1,
        });
        expect(sequences.length).toBe(1);
        const sequence = sequences[0];
        expect(sequence.number).toBe(1);
        expect(sequence.startTick).toBe(50);
        expect(sequence.endTick).toBe(220);
    });
    it('should not generate a sequence with a start tick < 1', () => {
        const firstKill = {
            killerSteamId,
            tick: 20,
        };
        const match = {
            ...baseMatch,
            players: [killer],
            kills: [firstKill],
        };
        const sequences = buildPlayersEventSequences({
            event: PlayerSequenceEvent.Kills,
            match,
            steamIds: [killerSteamId],
            rounds: [],
            perspective: Perspective.Player,
            weapons: [],
            settings: defaultSettings.video,
            startSecondsBeforeEvent: 5,
            endSecondsAfterEvent: 2,
            firstSequenceNumber: 1,
        });
        expect(sequences[0].startTick).toBe(1);
    });
    it('should not generate a sequence with an end tick above the demo ticks', () => {
        const firstKill = {
            killerSteamId,
            tick: 95,
        };
        const match = {
            ...baseMatch,
            tickCount: 100,
            players: [killer],
            kills: [firstKill],
        };
        const sequences = buildPlayersEventSequences({
            event: PlayerSequenceEvent.Kills,
            match,
            steamIds: [killerSteamId],
            rounds: [],
            perspective: Perspective.Player,
            weapons: [],
            settings: defaultSettings.video,
            startSecondsBeforeEvent: 5,
            endSecondsAfterEvent: 2,
            firstSequenceNumber: 1,
        });
        expect(sequences[0].endTick).toBe(100);
    });
});
//# sourceMappingURL=build-players-event-sequences.test.js.map