import React, { useEffect, useRef, useState } from 'react';
import { Trans } from '@lingui/react/macro';
import WaveSurfer from 'wavesurfer.js';
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom';
import { Popover, PopoverContent, PopoverTrigger } from 'csdm/ui/components/popover/popover';
import { useViewerContext } from '../use-viewer-context';
import { PlaybackBarButton } from './playback-bar-button';
import { SoundIcon } from 'csdm/ui/icons/sound-icon';
import { PlayIcon } from 'csdm/ui/icons/play-icon';
import { PauseIcon } from 'csdm/ui/icons/pause-icon';
import { Spinner } from 'csdm/ui/components/spinner';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { useViewer2DState } from '../use-viewer-state';
import { useThemeName } from 'csdm/ui/settings/ui/use-theme-name';
import { ThemeName } from 'csdm/common/types/theme-name';
import { VerticalSlider } from './vertical-slider';
function useWavSurfer(container, audioBytes) {
    const [ws, setWs] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const theme = useThemeName();
    useEffect(() => {
        let instance = null;
        let unsubscribeFns = [];
        (async () => {
            if (!container?.current) {
                return;
            }
            const zoom = ZoomPlugin.create({
                scale: 0.5,
                maxZoom: 100, // max pixels per second
            });
            instance = WaveSurfer.create({
                container: container.current,
                waveColor: theme === ThemeName.Dark ? '#CCCCCC' : '#333333',
                progressColor: theme === ThemeName.Dark ? '#333333' : '#CCCCCC',
                hideScrollbar: true,
                dragToSeek: true,
                plugins: [zoom],
            });
            unsubscribeFns = [
                instance.on('load', () => {
                    setIsPlaying(false);
                    setWs(null);
                    setCurrentTime(0);
                }),
                instance.on('ready', (duration) => {
                    setIsPlaying(false);
                    setCurrentTime(0);
                    instance?.setOptions({
                        minPxPerSec: (duration / 1000) * 10, // 10 pixels per second
                    });
                }),
                instance.on('timeupdate', () => {
                    if (instance) {
                        setCurrentTime(instance.getCurrentTime());
                    }
                }),
                instance.on('play', () => setIsPlaying(true)),
                instance.on('pause', () => setIsPlaying(false)),
                instance.on('destroy', () => {
                    setIsPlaying(false);
                    setWs(null);
                    setCurrentTime(0);
                }),
            ];
            const blob = new Blob([audioBytes]);
            await instance.loadBlob(blob);
            setWs(instance);
        })();
        return () => {
            instance?.destroy();
            unsubscribeFns.forEach((unsubscribe) => unsubscribe());
        };
    }, [container, audioBytes, theme]);
    return { currentTime, isPlaying, ws };
}
function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60)
        .toString()
        .padStart(2, '0');
    const seconds = Math.floor(timeInSeconds % 60)
        .toString()
        .padStart(2, '0');
    return `${minutes}:${seconds}`;
}
function AudioPopover() {
    const containerRef = useRef(null);
    const { audioBytes, updateAudioOffset, resetAudioOffset, unloadAudioFile, volume, updateVolume, currentTick, tickrate, } = useViewerContext();
    const { audioOffsetSeconds } = useViewer2DState();
    const { currentTime, isPlaying, ws } = useWavSurfer(containerRef, audioBytes);
    const focused = useRef(false);
    useEffect(() => {
        // keep in sync the WaveSurfer instance with the playback state
        const time = currentTick / tickrate + audioOffsetSeconds;
        ws?.setTime(time);
    }, [ws, currentTick, tickrate, audioOffsetSeconds]);
    useEffect(() => {
        ws?.setVolume(volume);
    }, [ws, volume]);
    const duration = ws ? ws.getDuration() : 0;
    const elapsedTime = formatTime(currentTime);
    const totalDuration = formatTime(duration);
    const offsetSeconds = Math.round(audioOffsetSeconds);
    return (React.createElement("div", { className: "flex w-[37.5rem] cursor-default items-center justify-between rounded-8 bg-gray-100 p-16" },
        React.createElement("div", { className: "flex w-full flex-col" },
            React.createElement("div", { ref: containerRef, className: "waveform" }),
            ws ? (React.createElement("div", { className: "flex flex-col gap-y-8" },
                React.createElement("input", { className: "w-full", type: "range", value: currentTime, min: 0, step: 0.1, max: ws.getDuration(), onChange: (event) => {
                        ws.setTime(Number(event.target.value));
                    } }),
                React.createElement("div", { className: "flex w-full flex-wrap items-center justify-between gap-x-8" },
                    React.createElement("div", { className: "flex items-center gap-x-8" },
                        React.createElement("button", { className: "size-16 shrink-0 cursor-pointer", onClick: () => {
                                ws.playPause();
                            }, ref: (element) => {
                                if (element && !focused.current) {
                                    element.focus();
                                    focused.current = true;
                                }
                            } }, isPlaying ? React.createElement(PauseIcon, null) : React.createElement(PlayIcon, null)),
                        React.createElement("input", { className: "w-[60px]", type: "range", value: volume, min: 0, step: 0.01, max: 1, onChange: (event) => {
                                updateVolume(Number(event.target.value));
                            } }),
                        React.createElement("p", null,
                            React.createElement(Trans, null,
                                elapsedTime,
                                "/",
                                totalDuration))),
                    React.createElement("p", null,
                        React.createElement(Trans, null,
                            "Offset: ",
                            offsetSeconds,
                            "s"))),
                React.createElement("div", { className: "flex items-center justify-between gap-x-8" },
                    React.createElement("div", { className: "flex items-center gap-x-8" },
                        React.createElement(Button, { variant: ButtonVariant.Primary, onClick: () => {
                                updateAudioOffset(ws.getCurrentTime() - currentTick / tickrate);
                            } },
                            React.createElement(Trans, null, "Set as current position")),
                        React.createElement(Button, { onClick: () => {
                                resetAudioOffset();
                            } },
                            React.createElement(Trans, null, "Reset position"))),
                    React.createElement(Button, { onClick: () => {
                            unloadAudioFile();
                        } },
                        React.createElement(Trans, null, "Unload file"))))) : (React.createElement("div", { className: "absolute inset-0 flex size-full items-center justify-center" },
                React.createElement(Spinner, { size: 40 }))))));
}
export function AudioButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    const { pause, updateVolume, volume } = useViewerContext();
    return (React.createElement(Popover, { open: isOpen, onOpenChange: () => {
            setIsOpen(!isOpen);
            setIsPopoverVisible(false);
        }, openOnHover: !isPopoverVisible },
        React.createElement(PopoverTrigger, { asChild: true },
            React.createElement(PlaybackBarButton, { onClick: () => {
                    pause();
                    setIsPopoverVisible(!isPopoverVisible);
                } },
                React.createElement(SoundIcon, { className: "size-20" }))),
        React.createElement(PopoverContent, { onKeyDown: (event) => {
                // Prevent global 2D viewer keyboard shortcuts while the popover is open
                event.stopPropagation();
            } }, isPopoverVisible ? (React.createElement(AudioPopover, null)) : (React.createElement(VerticalSlider, { min: 0, max: 1, step: 0.01, value: volume, onChange: (event) => {
                updateVolume(+event.target.value);
            } })))));
}
//# sourceMappingURL=audio-button.js.map