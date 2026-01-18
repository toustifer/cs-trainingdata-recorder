import React, { useState, useEffect, useCallback } from 'react';
import { Trans } from '@lingui/react/macro';
import { Status } from 'csdm/common/types/status';
import { Viewer2D } from './viewer-2d';
import { UnsupportedMap } from '../../components/unsupported-map';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { Message } from 'csdm/ui/components/message';
import { useCurrentMatchMap } from '../use-current-match-map';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { useCurrentMatch } from '../use-current-match';
import { ViewerProvider } from './viewer-context';
import { useParams } from 'react-router';
import { ErrorCode } from 'csdm/common/error-code';
import { NoPositionsFound } from './no-positions-found';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { audioLoaded, resetAudioOffset } from './viewer-actions';
const defaultState = {
    error: undefined,
    kills: [],
    shots: [],
    playerPositions: [],
    grenadePositions: [],
    infernoPositions: [],
    chickenPositions: [],
    decoysStart: [],
    heGrenadesExplode: [],
    flashbangsExplode: [],
    smokesStart: [],
    hostagesPickUpStart: [],
    hostagesPickedUp: [],
    hostagePositions: [],
    bombsPlantStart: [],
    bombsDefuseStart: [],
    bombExploded: null,
    bombPlanted: null,
    bombDefused: null,
    round: undefined,
    status: Status.Loading,
    audio: null,
    audioBytes: new Uint8Array(),
};
export function Viewer2DLoader() {
    const { number: roundNumberParameter } = useParams();
    const roundNumber = Number(roundNumberParameter || 1);
    const client = useWebSocketClient();
    const match = useCurrentMatch();
    const map = useCurrentMatchMap();
    const [state, setState] = useState(defaultState);
    const showToast = useShowToast();
    const dispatch = useDispatch();
    const loadAudioFile = useCallback(async (audioFilePath) => {
        if (state.audio) {
            return;
        }
        const data = await window.csdm.getDemoAudioData(match.checksum, audioFilePath);
        if (data) {
            dispatch(audioLoaded(data));
            setState((state) => {
                return {
                    ...state,
                    audio: data.audio,
                    audioBytes: data.audioBytes,
                };
            });
        }
    }, [match.checksum, state.audio, dispatch]);
    const unloadAudioFile = () => {
        dispatch(resetAudioOffset());
        setState((state) => {
            return {
                ...state,
                audio: null,
                audioBytes: new Uint8Array(),
            };
        });
    };
    useEffect(() => {
        if (state.status !== Status.Loading && (!state.round || state.round.number === roundNumber)) {
            return;
        }
        const fetchData = async () => {
            try {
                const payload = {
                    checksum: match.checksum,
                    demoFilePath: match.demoFilePath,
                    roundNumber,
                };
                setState((state) => {
                    return {
                        ...state,
                        status: Status.Loading,
                    };
                });
                const result = await client.send({
                    name: RendererClientMessageName.Fetch2DViewerData,
                    payload,
                });
                if (result.audioFilePath) {
                    try {
                        await loadAudioFile(result.audioFilePath);
                    }
                    catch (error) {
                        logger.error('Error fetching demo audio data');
                        logger.error(error);
                        showToast({
                            type: 'error',
                            content: (React.createElement("div", null,
                                React.createElement("p", null,
                                    React.createElement(Trans, null, "An error occurred while loading the audio file found for this match.")),
                                React.createElement("p", null,
                                    React.createElement(Trans, null, "Make sure the file is a valid audio file.")))),
                        });
                    }
                }
                setState((state) => {
                    return {
                        ...state,
                        ...result,
                        status: Status.Success,
                    };
                });
            }
            catch (error) {
                let errorMessage = React.createElement(Trans, null,
                    "An error occurred while loading round number ",
                    roundNumber,
                    ".");
                if (error === ErrorCode.RoundNotFound) {
                    errorMessage = React.createElement(Trans, null,
                        "Round number ",
                        roundNumber,
                        " not found.");
                }
                setState((state) => ({
                    ...state,
                    status: Status.Error,
                    error: errorMessage,
                }));
            }
        };
        fetchData();
    }, [
        showToast,
        client,
        dispatch,
        state.status,
        state.round,
        roundNumber,
        match.checksum,
        match.demoFilePath,
        loadAudioFile,
    ]);
    useEffect(() => {
        return () => {
            if (state.audio) {
                state.audio.pause();
                state.audio.currentTime = 0;
                state.audio.src = '';
            }
        };
    }, [state.audio]);
    if (state.status === Status.Loading) {
        return React.createElement(Message, { message: React.createElement(Trans, null,
                "Loading round number ",
                roundNumber,
                "\u2026") });
    }
    if (state.status === Status.Error) {
        return React.createElement(Message, { message: state.error });
    }
    if (map === undefined || map.radarFilePath === undefined) {
        return React.createElement(UnsupportedMap, null);
    }
    if (state.round === undefined) {
        return React.createElement(Message, { message: React.createElement(Trans, null,
                "Round number ",
                roundNumber,
                " not found.") });
    }
    if (Object.keys(state.playerPositions).length === 0) {
        return (React.createElement(NoPositionsFound, { onPositionsAvailable: () => {
                setState({
                    ...state,
                    status: Status.Loading,
                });
            } }));
    }
    return (React.createElement(ViewerProvider, { map: map, shots: state.shots, kills: state.kills, round: state.round, playerPositions: state.playerPositions, hostagesPickUpStart: state.hostagesPickUpStart, hostagesPickedUp: state.hostagesPickedUp, hostagePositions: state.hostagePositions, grenadePositions: state.grenadePositions, infernoPositions: state.infernoPositions, chickenPositions: state.chickenPositions, decoysStart: state.decoysStart, heGrenadesExplode: state.heGrenadesExplode, flashbangsExplode: state.flashbangsExplode, smokesStart: state.smokesStart, bombExploded: state.bombExploded, bombPlanted: state.bombPlanted, bombDefused: state.bombDefused, bombsDefuseStart: state.bombsDefuseStart, bombsPlantStart: state.bombsPlantStart, audio: state.audio, audioBytes: state.audioBytes, loadAudioFile: loadAudioFile, unloadAudioFile: unloadAudioFile },
        React.createElement(Viewer2D, null)));
}
//# sourceMappingURL=viewer-2d-loader.js.map