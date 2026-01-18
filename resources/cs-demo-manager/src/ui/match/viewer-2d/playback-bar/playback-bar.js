import React from 'react';
import { Timeline } from './timeline';
import { PlayPauseButton } from './play-pause-button';
import { SpeedButton } from './speed-button';
import { FullscreenButton } from './fullscreen-button';
import { NextRoundButton } from './next-round-button';
import { PreviousRoundButton } from './previous-round-button';
import { LowerRadarButton } from './lower-radar-button';
import { AudioButton } from './audio-button';
import { AudioSelectorButton } from './audio-selector-button';
import { useViewerContext } from '../use-viewer-context';
import { DocumentationLink } from 'csdm/ui/components/links/documentation-link';
import { DrawingButton } from './drawing-button';
export function PlaybackBar({ drawing }) {
    const { loadAudioFile, audioBytes } = useViewerContext();
    return (React.createElement("div", { className: "relative flex h-40 cursor-pointer" },
        React.createElement(PlayPauseButton, null),
        React.createElement(PreviousRoundButton, null),
        React.createElement(NextRoundButton, null),
        React.createElement(SpeedButton, null),
        audioBytes.length > 0 ? React.createElement(AudioButton, null) : React.createElement(AudioSelectorButton, { loadAudioFile: loadAudioFile }),
        React.createElement(Timeline, null),
        React.createElement(DrawingButton, { drawing: drawing }),
        React.createElement(LowerRadarButton, null),
        React.createElement(FullscreenButton, null),
        React.createElement("div", { className: "flex items-center px-8" },
            React.createElement(DocumentationLink, { url: "https://cs-demo-manager.com/docs/guides/2d-viewer" }))));
}
//# sourceMappingURL=playback-bar.js.map