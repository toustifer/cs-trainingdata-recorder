import React from 'react';
import { DemoSource } from 'csdm/common/types/counter-strike';
import { useUiSettings } from 'csdm/ui/settings/ui/use-ui-settings';
import { ThemeName } from 'csdm/common/types/theme-name';
import { useGetDemoSourceName } from 'csdm/ui/demos/use-demo-sources';
import { assertNever } from 'csdm/common/assert-never';
function useDemoSourceImageSrc(source) {
    const { theme } = useUiSettings();
    const isDarkTheme = theme === ThemeName.Dark;
    let fileName;
    switch (source) {
        case DemoSource.Cevo:
        case DemoSource.Esea:
        case DemoSource.Esl:
        case DemoSource.FaceIt:
        case DemoSource.Popflash:
        case DemoSource.Valve:
        case DemoSource.Esportal:
        case DemoSource.Fastcup:
        case DemoSource.Gamersclub:
        case DemoSource.PerfectWorld:
        case DemoSource.Renown:
            fileName = isDarkTheme ? `${source}-white.png` : `${source}-black.png`;
            break;
        case DemoSource.Challengermode:
            fileName = 'challengermode.png';
            break;
        case DemoSource.Ebot:
            fileName = 'ebot.png';
            break;
        case DemoSource.Esplay:
            fileName = 'esplay.png';
            break;
        case DemoSource.FiveEPlay:
            fileName = '5eplay.png';
            break;
        case DemoSource.MatchZy:
            fileName = 'matchzy.png';
            break;
        case DemoSource.Unknown:
            fileName = 'unknown.png';
            break;
        default:
            return assertNever(source, `Unknown source: ${source}`);
    }
    return `file://${window.csdm.IMAGES_FOLDER_PATH}/sources/${fileName}`;
}
export function SourceCell({ data }) {
    const { source } = data;
    const src = useDemoSourceImageSrc(source);
    const getDemoSourceName = useGetDemoSourceName();
    return React.createElement("img", { className: "mx-auto", src: src, alt: source, title: getDemoSourceName(source) });
}
//# sourceMappingURL=source-cell.js.map