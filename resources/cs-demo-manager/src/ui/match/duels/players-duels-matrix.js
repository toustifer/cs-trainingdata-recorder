import React, { useEffect, useRef, useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { TeamNumber } from 'csdm/common/types/counter-strike';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { Panel } from 'csdm/ui/components/panel';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { getColorAtPercentage, hexToRgb } from 'csdm/ui/shared/colors';
import { ExportHtmlElementAsImageButton } from 'csdm/ui/components/buttons/export-html-element-as-image-button';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { Status } from 'csdm/common/types/status';
import { Spinner } from 'csdm/ui/components/spinner';
import { ErrorMessage } from 'csdm/ui/components/error-message';
import { Content } from 'csdm/ui/components/content';
import { TeamIndicator } from 'csdm/ui/components/match/team-indicator';
import { Message } from 'csdm/ui/components/message';
function CellTooltip({ killerName, victimName, killCount }) {
    return (React.createElement("p", null,
        React.createElement(Trans, null,
            React.createElement("span", { className: "text-body-strong" }, killerName),
            " killed",
            ' ',
            React.createElement("span", { className: "text-body-strong" }, victimName),
            " ",
            React.createElement("span", { className: "text-body-strong" }, killCount),
            ' ',
            "times")));
}
function Cell({ killCount, backgroundColor, killerName, victimName }) {
    return (React.createElement(Tooltip, { content: React.createElement(CellTooltip, { killerName: killerName, victimName: victimName, killCount: killCount }), delay: 0, placement: "top", renderInPortal: true },
        React.createElement("div", { className: "flex size-40 selectable items-center justify-center rounded-full transition-transform duration-100 hover:scale-110", style: { backgroundColor } },
            React.createElement("span", { className: "text-subtitle text-white" }, killCount))));
}
export function PlayersDuelsMatrix() {
    const client = useWebSocketClient();
    const match = useCurrentMatch();
    const chart = useRef(null);
    const [rows, setRows] = useState([]);
    const startColor = hexToRgb('#991b1b');
    const endColor = hexToRgb('#166534');
    const [status, setStatus] = useState(Status.Loading);
    useEffect(() => {
        const fetchRows = async () => {
            try {
                const result = await client.send({
                    name: RendererClientMessageName.FetchMatchDuelsMatrixRows,
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
    const playersTeamCt = [];
    const playersTeamT = [];
    for (const row of rows) {
        const players = row.killerTeamSide === TeamNumber.CT ? playersTeamCt : playersTeamT;
        if (players.some((player) => player.steamId === row.killerSteamId)) {
            continue;
        }
        players.push({
            steamId: row.killerSteamId,
            name: row.killerName,
            teamNumber: row.killerTeamSide,
            rows: rows.filter(({ killerSteamId }) => killerSteamId === row.killerSteamId),
        });
    }
    const hasKills = playersTeamCt.length > 0 && playersTeamT.length > 0;
    const renderPanelContent = () => {
        if (status === Status.Success) {
            if (!hasKills) {
                return (React.createElement("div", { className: "pb-8" },
                    React.createElement(Message, { message: React.createElement(Trans, null, "No kills found between both teams.") })));
            }
            return (React.createElement("div", { className: "flex w-fit flex-col", ref: chart },
                React.createElement("div", { className: "mb-8 flex" },
                    React.createElement("div", { className: "flex w-[172px]" }),
                    playersTeamT.map((player) => {
                        return (React.createElement("div", { key: player.steamId, className: "flex w-[104px] flex-col gap-y-4" },
                            React.createElement("p", { className: "selectable truncate overflow-hidden", title: player.name }, player.name),
                            React.createElement(TeamIndicator, { teamNumber: player.teamNumber })));
                    })),
                playersTeamCt.map((player) => {
                    return (React.createElement("div", { key: player.steamId, className: "flex" },
                        React.createElement("div", { className: "flex items-center gap-x-8" },
                            React.createElement("p", { className: "w-[148px] selectable truncate", title: player.name }, player.name),
                            React.createElement(TeamIndicator, { teamNumber: player.teamNumber })),
                        React.createElement("div", { className: "ml-8 flex h-[84px]" }, player.rows.map(({ victimSteamId, victimName, killCount, deathCount }) => {
                            const hasData = killCount > 0 || deathCount > 0;
                            const winRatePercent = (killCount / (killCount + deathCount)) * 100;
                            const killerColor = hasData
                                ? getColorAtPercentage(startColor, endColor, winRatePercent)
                                : 'transparent';
                            const victimColor = hasData
                                ? getColorAtPercentage(startColor, endColor, 100 - winRatePercent)
                                : 'transparent';
                            return (React.createElement("div", { key: victimSteamId, className: "flex h-full w-[104px] flex-col border border-gray-300" }, hasData ? (React.createElement("div", { className: "relative flex size-full bg-[linear-gradient(45deg,var(--gray-75)_50%,var(--gray-200)_50%)]" },
                                React.createElement("div", { className: "absolute bottom-8 left-12" },
                                    React.createElement(Cell, { killCount: killCount, backgroundColor: killerColor, killerName: player.name, victimName: victimName })),
                                React.createElement("div", { className: "absolute top-8 right-12" },
                                    React.createElement(Cell, { killCount: deathCount, backgroundColor: victimColor, killerName: victimName, victimName: player.name })))) : (React.createElement("span", { className: "flex h-full items-center justify-center text-subtitle" }, "-"))));
                        }))));
                })));
        }
        return (React.createElement("div", { className: "flex justify-center pb-8" }, status === Status.Error ? React.createElement(ErrorMessage, { message: React.createElement(Trans, null, "An error occurred") }) : React.createElement(Spinner, { size: 42 })));
    };
    return (React.createElement(Content, null,
        React.createElement("div", null,
            React.createElement(Panel, { header: React.createElement("div", null, status === Status.Success && hasKills && (React.createElement(ExportHtmlElementAsImageButton, { getElement: () => chart.current, getFileName: () => `duels-matrix-${Date.now()}` }))) }, renderPanelContent()))));
}
//# sourceMappingURL=players-duels-matrix.js.map