import { isWindows } from 'csdm/node/os/is-windows';
import { RecordingSystem } from 'csdm/common/types/recording-system';
import { RecordingOutput } from 'csdm/common/types/recording-output';
const v6 = {
    schemaVersion: 6,
    run: (settings) => {
        settings.download.download5EPlayDemosAtStartup = true;
        settings.download.download5EPlayDemosInBackground = true;
        settings.video.showXRay = true;
        settings.video.playerVoicesEnabled = true;
        settings.ui.redirectDemoToMatch = false;
        settings.video.recordingSystem = isWindows ? RecordingSystem.HLAE : RecordingSystem.CounterStrike;
        settings.video.recordingOutput = RecordingOutput.Video;
        return Promise.resolve(settings);
    },
};
// eslint-disable-next-line no-restricted-syntax
export default v6;
//# sourceMappingURL=v6.js.map