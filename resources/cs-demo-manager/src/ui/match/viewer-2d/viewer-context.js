import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { useCurrentMatch } from '../use-current-match';
import { buildMatch2dViewerRoundPath } from 'csdm/ui/routes-paths';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { audioOffsetChanged, focusedPlayerChanged, resetAudioOffset, speedChanged, volumeChanged, } from './viewer-actions';
import { useViewer2DState } from './use-viewer-state';
import { deleteDemoAudioOffset, persistDemoAudioOffset } from './audio/audio-offset';
import { isDefuseMapFromName } from 'csdm/common/counter-strike/is-defuse-map-from-name';
export const ViewerContext = createContext(undefined);
export function ViewerProvider({ children, map, round, kills, shots, playerPositions, hostagesPickUpStart, hostagesPickedUp, hostagePositions, grenadePositions, infernoPositions, chickenPositions, bombsPlantStart, bombsDefuseStart, bombExploded, bombPlanted, bombDefused, decoysStart, heGrenadesExplode, smokesStart, flashbangsExplode, audio, audioBytes, loadAudioFile, unloadAudioFile, }) {
    const dispatch = useDispatch();
    const match = useCurrentMatch();
    const viewerState = useViewer2DState();
    const [mode, setMode] = useState('playback');
    const [drawingTool, setDrawingTool] = useState('pen');
    const [drawingSize, setDrawingSize] = useState(2);
    const [drawingColor, setDrawingColor] = useState('#ff0000');
    const [currentTick, setCurrentTick] = useState(round.freezetimeEndTick);
    const [isPlaying, setIsPlaying] = useState(false);
    const [lowerRadarOffsetX, setLowerRadarOffsetX] = useState(() => {
        const value = window.localStorage.getItem(`${match.game}_${match.mapName}_lower_radar_offset_x`);
        return value ? Number.parseInt(value) : 0;
    });
    const [lowerRadarOffsetY, setLowerRadarOffsetY] = useState(() => {
        const value = window.localStorage.getItem(`${match.game}_${match.mapName}_lower_radar_offset_y`);
        return value ? Number.parseInt(value) : 0;
    });
    const [lowerRadarOpacity, setLowerRadarOpacity] = useState(() => {
        const value = window.localStorage.getItem(`${match.game}_${match.mapName}_lower_radar_opacity`);
        return value ? Number.parseFloat(value) : 1;
    });
    const remainingTickCount = round.endOfficiallyTick - currentTick;
    const tickrate = match.tickrate > 0 ? match.tickrate : 64;
    const timeRemaining = (remainingTickCount / tickrate) * 1000;
    const shouldDrawBombs = isDefuseMapFromName(match.mapName);
    const navigate = useNavigate();
    const { audioOffsetSeconds, volume } = viewerState;
    const clampAudioTime = (seconds) => {
        if (!audio || isNaN(audio.duration)) {
            return 0;
        }
        return Math.max(0, Math.min(seconds, audio.duration));
    };
    const play = async (tick) => {
        setIsPlaying(true);
        if (tick) {
            setCurrentTick(tick);
        }
        if (audio) {
            // eslint-disable-next-line react-hooks/immutability
            audio.currentTime = clampAudioTime((tick ?? currentTick) / tickrate + audioOffsetSeconds);
            try {
                await audio.play();
            }
            catch (error) {
                // noop
            }
        }
    };
    const pause = () => {
        setIsPlaying(false);
        audio?.pause();
    };
    return (React.createElement(ViewerContext.Provider, { value: {
            mode,
            setMode,
            isDrawingMode: mode === 'drawing',
            toggleMode: () => setMode((mode) => {
                return mode === 'drawing' ? 'playback' : 'drawing';
            }),
            tickrate,
            map,
            currentTick,
            setCurrentTick,
            timeRemaining,
            isPlaying,
            volume,
            audioBytes,
            play,
            pause,
            playPause: async () => {
                if (isPlaying) {
                    pause();
                }
                else {
                    await play();
                }
            },
            updateVolume: (volume) => {
                if (!audio) {
                    return;
                }
                // eslint-disable-next-line react-hooks/immutability
                audio.volume = volume;
                dispatch(volumeChanged({ volume }));
            },
            updateAudioOffset: (seconds) => {
                if (!audio) {
                    return;
                }
                // eslint-disable-next-line react-hooks/immutability
                audio.currentTime = clampAudioTime(currentTick / tickrate + seconds);
                dispatch(audioOffsetChanged({ seconds }));
                persistDemoAudioOffset(match.checksum, seconds);
            },
            resetAudioOffset: () => {
                dispatch(resetAudioOffset());
                deleteDemoAudioOffset(match.checksum);
            },
            loadAudioFile,
            unloadAudioFile,
            game: match.game,
            shouldDrawBombs,
            playerPositions,
            heGrenadesExplode,
            smokesStart,
            decoysStart,
            flashbangsExplode,
            hostagesPickUpStart,
            hostagesPickedUp,
            hostagePositions,
            grenadePositions,
            infernoPositions,
            chickenPositions,
            bombsPlantStart,
            bombsDefuseStart,
            bombExploded,
            bombPlanted,
            bombDefused,
            kills,
            shots,
            round,
            drawingTool,
            setDrawingTool,
            drawingColor,
            setDrawingColor,
            drawingSize,
            setDrawingSize,
            changeRound: (roundNumber) => {
                audio?.pause();
                navigate(buildMatch2dViewerRoundPath(match.checksum, roundNumber));
            },
            speed: viewerState.speed,
            setSpeed: (speed) => {
                dispatch(speedChanged({ speed }));
                if (audio) {
                    // eslint-disable-next-line react-hooks/immutability
                    audio.playbackRate = speed;
                }
            },
            focusedPlayerId: viewerState.focusedPlayerId,
            updateFocusedPlayerId: (id) => {
                const newId = id === viewerState.focusedPlayerId ? undefined : id;
                dispatch(focusedPlayerChanged({ focusedPlayerId: newId }));
            },
            lowerRadarOffsetX,
            setLowerRadarOffsetX: (offsetX) => {
                window.localStorage.setItem(`${match.game}_${match.mapName}_lower_radar_offset_x`, String(offsetX));
                setLowerRadarOffsetX(offsetX);
            },
            lowerRadarOffsetY,
            setLowerRadarOffsetY: (offsetY) => {
                window.localStorage.setItem(`${match.game}_${match.mapName}_lower_radar_offset_y`, String(offsetY));
                setLowerRadarOffsetY(offsetY);
            },
            lowerRadarOpacity,
            setLowerRadarOpacity: (opacity) => {
                window.localStorage.setItem(`${match.game}_${match.mapName}_lower_radar_opacity`, String(opacity));
                setLowerRadarOpacity(opacity);
            },
        } }, children));
}
//# sourceMappingURL=viewer-context.js.map