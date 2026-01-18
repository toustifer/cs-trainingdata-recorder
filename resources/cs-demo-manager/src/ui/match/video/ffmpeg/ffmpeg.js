import React from 'react';
import { FfmpegAudioBitrateSelect } from 'csdm/ui/match/video/ffmpeg/ffmpeg-audio-bitrate-select';
import { ConstantRateFactorInput } from 'csdm/ui/match/video/ffmpeg/constant-rate-factor-input';
import { EncoderSoftware } from 'csdm/common/types/encoder-software';
import { Software } from 'csdm/ui/match/video/software';
import { FfmpegInstallButton } from 'csdm/ui/match/video/ffmpeg/ffmpeg-install-button';
import { FfmpegUpdateButton } from 'csdm/ui/match/video/ffmpeg/ffmpeg-update-button';
import { FfmpegBrowseButton } from 'csdm/ui/match/video/ffmpeg/ffmpeg-browse-button';
import { useInstalledFfmpegVersion } from 'csdm/ui/match/video/ffmpeg/use-installed-ffmpeg-version';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { VideoCodecInput } from './video-codec-input';
import { AudioCodecInput } from './audio-codec-input';
import { FfmpegInputParametersInput } from './ffmpeg-input-parameters-input';
import { FfmpegOutputParametersInput } from './ffmpeg-output-parameters-input';
import { VideoContainerSelect } from './video-container-select';
import { RecordingOutput } from 'csdm/common/types/recording-output';
export function Ffmpeg() {
    const installedFfmpegVersion = useInstalledFfmpegVersion();
    const { settings } = useVideoSettings();
    if (settings.encoderSoftware !== EncoderSoftware.FFmpeg || settings.recordingOutput === RecordingOutput.Images) {
        return null;
    }
    return (React.createElement("div", { className: "flex flex-col gap-y-8 rounded border border-gray-400 p-8" },
        React.createElement(Software, { name: "FFmpeg", websiteLink: "https://ffmpeg.org/documentation.html", version: installedFfmpegVersion },
            React.createElement(FfmpegInstallButton, null),
            React.createElement(FfmpegUpdateButton, null),
            React.createElement(FfmpegBrowseButton, null)),
        React.createElement("div", { className: "flex flex-col gap-y-8" },
            React.createElement("div", { className: "flex flex-wrap gap-8" },
                React.createElement(AudioCodecInput, null),
                React.createElement(FfmpegAudioBitrateSelect, null)),
            React.createElement("div", { className: "flex flex-wrap gap-8" },
                React.createElement(VideoContainerSelect, null),
                React.createElement(VideoCodecInput, null),
                React.createElement(ConstantRateFactorInput, null)),
            React.createElement(FfmpegInputParametersInput, null),
            React.createElement(FfmpegOutputParametersInput, null))));
}
//# sourceMappingURL=ffmpeg.js.map