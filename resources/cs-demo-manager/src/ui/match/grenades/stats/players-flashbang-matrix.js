import React, { useEffect, useRef, useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { Panel, PanelTitle } from 'csdm/ui/components/panel';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { getColorAtPercentage, hexToRgb } from 'csdm/ui/shared/colors';
import { ExportHtmlElementAsImageButton } from 'csdm/ui/components/buttons/export-html-element-as-image-button';
import { useCssVariableValue } from 'csdm/ui/hooks/use-css-variable-value';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { Status } from 'csdm/common/types/status';
import { Spinner } from 'csdm/ui/components/spinner';
import { ErrorMessage } from 'csdm/ui/components/error-message';
import { TeamIndicator } from 'csdm/ui/components/match/team-indicator';
export function PlayersFlashbangMatrix() {
    const client = useWebSocketClient();
    const match = useCurrentMatch();
    const chart = useRef(null);
    const [rows, setRows] = useState([]);
    const startColor = hexToRgb(useCssVariableValue('--gray-100'));
    const endColor = hexToRgb('#095aba');
    const [status, setStatus] = useState(Status.Loading);
    useEffect(() => {
        const fetchRows = async () => {
            try {
                const result = await client.send({
                    name: RendererClientMessageName.FetchMatchFlashbangMatrixRows,
                    payload: match.checksum,
                });
                setRows(result);
                setStatus(Status.Success);
            }
            catch (error) {
                setStatus(Status.Error);
            }
        };
        fetchRows();
    }, [client, match.checksum]);
    let maxDuration = 0;
    const players = [];
    for (const row of rows) {
        if (row.duration > maxDuration) {
            maxDuration = row.duration;
        }
        if (players.some((player) => player.steamId === row.flasherSteamId)) {
            continue;
        }
        players.push({
            steamId: row.flasherSteamId,
            name: row.flasherName,
            teamNumber: row.flasherTeamSide,
            rows: rows.filter((r) => r.flasherSteamId === row.flasherSteamId),
        });
    }
    const renderPanelContent = () => {
        if (status === Status.Success) {
            return (React.createElement("div", { className: "flex w-fit flex-col", ref: chart },
                players.map((flasher) => {
                    const flasherName = flasher.name;
                    return (React.createElement("div", { key: flasher.steamId, className: "flex" },
                        React.createElement("div", { className: "flex items-center gap-x-8" },
                            React.createElement("p", { className: "w-[128px] selectable truncate", title: flasherName }, flasherName),
                            React.createElement(TeamIndicator, { teamNumber: flasher.teamNumber })),
                        React.createElement("div", { className: "ml-8 flex" }, flasher.rows.map(({ flashedSteamId, flashedName, duration }) => {
                            return (React.createElement("div", { key: flashedSteamId, className: "flex w-[84px] flex-col" },
                                React.createElement(Tooltip, { content: React.createElement(Trans, null,
                                        React.createElement("span", { className: "text-body-strong" }, flasherName),
                                        " flashed",
                                        ' ',
                                        React.createElement("span", { className: "text-body-strong" }, flashedName),
                                        " around",
                                        ' ',
                                        React.createElement("span", { className: "text-body-strong" },
                                            duration,
                                            "s")), delay: 0, placement: "top" },
                                    React.createElement("div", { className: "flex selectable flex-col border border-gray-300 p-8 text-center text-body-strong transition-transform duration-100 hover:scale-110", style: {
                                            backgroundColor: getColorAtPercentage(startColor, endColor, (duration / maxDuration) * 100),
                                        } }, duration))));
                        }))));
                }),
                React.createElement("div", { className: "mt-8 flex" },
                    React.createElement("div", { className: "flex w-[152px]" }),
                    players.map((player) => {
                        return (React.createElement("div", { key: player.steamId, className: "flex w-[84px] flex-col gap-y-4" },
                            React.createElement(TeamIndicator, { teamNumber: player.teamNumber }),
                            React.createElement("p", { className: "selectable overflow-hidden wrap-break-word", title: player.name }, player.name)));
                    }))));
        }
        return (React.createElement("div", { className: "flex justify-center pb-8" }, status === Status.Error ? React.createElement(ErrorMessage, { message: React.createElement(Trans, null, "An error occurred") }) : React.createElement(Spinner, { size: 42 })));
    };
    return (React.createElement(Panel, { header: React.createElement("div", { className: "flex items-center gap-x-16" },
            React.createElement(PanelTitle, null,
                React.createElement(Trans, null, "Players flashbang matrix")),
            status === Status.Success && (React.createElement(ExportHtmlElementAsImageButton, { getElement: () => chart.current, getFileName: () => `flashbang-matrix-${Date.now()}` }))) }, renderPanelContent()));
}
//# sourceMappingURL=players-flashbang-matrix.js.map