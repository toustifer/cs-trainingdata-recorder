import React, { useState, useEffect } from 'react';
import { Plural, Trans } from '@lingui/react/macro';
import { Message } from 'csdm/ui/components/message';
import { Status } from 'csdm/common/types/status';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { BanPerCompetitiveRankChart } from './ban-per-competitive-rank-chart';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { NoStats } from 'csdm/ui/ban/stats/no-stats';
import { BanPerDateChart } from './ban-per-date-chart';
import { Panel, PanelTitle, PanelValue, PanelValueVariant } from 'csdm/ui/components/panel';
import { Content } from 'csdm/ui/components/content';
import { RendererServerMessageName } from 'csdm/server/renderer-server-message-name';
import { LastBans } from './last-bans';
import { BanPerPremierRankChart } from './ban-per-premier-rank-chart';
import { roundNumber } from 'csdm/common/math/round-number';
import { useBanSettings } from 'csdm/ui/settings/bans/use-ban-settings';
function formatDateToDurationYears(date) {
    const now = Date.now();
    const duration = now - new Date(date).getTime();
    const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25;
    const years = duration / millisecondsPerYear;
    return roundNumber(years, 1);
}
export function BanStats() {
    const client = useWebSocketClient();
    const { ignoreBanBeforeFirstSeen } = useBanSettings();
    const [status, setStatus] = useState(Status.Loading);
    const [stats, setStats] = useState({
        bannedAccountCount: 0,
        accountCount: 0,
        bannedAccountPercentage: 0,
        averageBannedAccountPerMatch: 0,
        bannedAccounts: [],
        averageBannedAccountAgeInYears: 0,
        medianBannedAccountAgeInYears: 0,
    });
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const stats = await client.send({
                    name: RendererClientMessageName.FetchBanStats,
                });
                setStats({
                    ...stats,
                    medianBannedAccountAgeInYears: stats.medianBannedAccountAgeInMonths
                        ? formatDateToDurationYears(stats.medianBannedAccountAgeInMonths)
                        : 0,
                    averageBannedAccountAgeInYears: stats.averageBannedAccountAgeInMonths
                        ? formatDateToDurationYears(stats.averageBannedAccountAgeInMonths)
                        : 0,
                });
                setStatus(Status.Success);
            }
            catch (error) {
                setStatus(Status.Error);
            }
        };
        fetchStats();
        client.on(RendererServerMessageName.IgnoredSteamAccountsChanged, fetchStats);
        return () => {
            client.off(RendererServerMessageName.IgnoredSteamAccountsChanged, fetchStats);
        };
    }, [client, ignoreBanBeforeFirstSeen]);
    if (status === Status.Loading) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "Loading ban stats\u2026") });
    }
    if (status === Status.Error) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "An error occurred") });
    }
    const { bannedAccounts, bannedAccountCount, bannedAccountPercentage, averageBannedAccountPerMatch, accountCount, averageBannedAccountAgeInYears, medianBannedAccountAgeInYears, } = stats;
    if (accountCount === 0) {
        return React.createElement(NoStats, null);
    }
    return (React.createElement(Content, null,
        React.createElement("div", { className: "flex flex-col gap-y-12" },
            React.createElement("div", { className: "flex flex-wrap gap-12" },
                React.createElement(Panel, { header: React.createElement(React.Fragment, null,
                        React.createElement(PanelTitle, null,
                            React.createElement(Trans, { context: "Panel title" }, "Players")),
                        React.createElement(PanelValue, { variant: PanelValueVariant.Big }, accountCount.toLocaleString())) }),
                React.createElement(Panel, { header: React.createElement(React.Fragment, null,
                        React.createElement(PanelTitle, null,
                            React.createElement(Trans, { context: "Panel title" }, "Banned players")),
                        React.createElement(PanelValue, { variant: PanelValueVariant.Big }, bannedAccountCount.toLocaleString())) }),
                React.createElement(Panel, { header: React.createElement(React.Fragment, null,
                        React.createElement(PanelTitle, null,
                            React.createElement(Trans, { context: "Panel title" }, "Banned players percentage")),
                        React.createElement(PanelValue, { variant: PanelValueVariant.Big }, `${bannedAccountPercentage.toLocaleString()}%`)) }),
                React.createElement(Panel, { header: React.createElement(React.Fragment, null,
                        React.createElement(PanelTitle, null,
                            React.createElement(Trans, { context: "Panel title" }, "AVG banned players/match")),
                        React.createElement(PanelValue, { variant: PanelValueVariant.Big }, averageBannedAccountPerMatch.toLocaleString())) }),
                React.createElement(Panel, { header: React.createElement(React.Fragment, null,
                        React.createElement(PanelTitle, null,
                            React.createElement(Trans, { context: "Panel title" }, "AVG banned account age")),
                        React.createElement(PanelValue, { variant: PanelValueVariant.Big },
                            React.createElement(Plural, { value: averageBannedAccountAgeInYears, one: "# year", other: "# years" }))) }),
                React.createElement(Panel, { header: React.createElement(React.Fragment, null,
                        React.createElement(PanelTitle, null,
                            React.createElement(Trans, { context: "Panel title" }, "Median banned account age")),
                        React.createElement(PanelValue, { variant: PanelValueVariant.Big },
                            React.createElement(Plural, { value: medianBannedAccountAgeInYears, one: "# year", other: "# years" }))) })),
            React.createElement(LastBans, { bannedAccounts: bannedAccounts }),
            React.createElement(BanPerCompetitiveRankChart, { bannedAccounts: bannedAccounts }),
            React.createElement(BanPerPremierRankChart, { bannedAccounts: bannedAccounts }),
            React.createElement(BanPerDateChart, { bannedAccounts: bannedAccounts }))));
}
//# sourceMappingURL=ban-stats.js.map