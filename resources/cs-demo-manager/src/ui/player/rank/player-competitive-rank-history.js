import React from 'react';
import { useLingui } from '@lingui/react/macro';
import { renderToString } from 'react-dom/server';
import { useLocale } from 'csdm/ui/settings/ui/use-locale';
import { useChart } from 'csdm/ui/hooks/use-chart';
import { CompetitiveRank } from 'csdm/common/types/counter-strike';
import { useChartColors } from 'csdm/ui/hooks/use-charts-colors';
import { usePlayer } from '../use-player';
import { useGetWinCountTranslation } from './use-get-win-count-translation';
export function PlayerCompetitiveRankHistory() {
    const { competitiveRankHistory } = usePlayer();
    const { t } = useLingui();
    const colors = useChartColors();
    const locale = useLocale();
    const getWinCountTranslation = useGetWinCountTranslation();
    const richConfig = {};
    const ranks = Object.values(CompetitiveRank).filter((rank) => rank !== CompetitiveRank.Unknown);
    for (const rankNumber of ranks) {
        richConfig[rankNumber] = {
            height: 30,
            width: 70,
            backgroundColor: {
                image: window.csdm.getRankImageSrc(rankNumber),
            },
        };
    }
    const option = {
        tooltip: {
            backgroundColor: colors.tooltipBackgroundColor,
            borderColor: colors.tooltipBorderColor,
            textStyle: {
                color: colors.tooltipTextColor,
            },
            formatter: (parameters) => {
                const { data } = parameters;
                const [matchDate, rank, previousRank, winCount] = data;
                const date = new Intl.DateTimeFormat(locale, {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                }).format(new Date(matchDate));
                return renderToString(React.createElement("div", { className: "flex flex-col gap-y-4" },
                    React.createElement("div", { className: "flex items-center gap-x-4" },
                        React.createElement("img", { src: window.csdm.getRankImageSrc(previousRank), className: "h-32" }),
                        React.createElement("span", null, '->'),
                        React.createElement("img", { src: window.csdm.getRankImageSrc(rank), className: "h-32" })),
                    React.createElement("div", { className: "mt-8 flex flex-col" },
                        React.createElement("p", null, getWinCountTranslation(winCount)),
                        React.createElement("p", null, date))));
            },
        },
        title: {
            text: t({
                context: 'Chart title',
                message: 'Competitive matchmaking rank history',
            }),
            left: 'center',
            textStyle: {
                color: colors.titleTextColor,
                fontWeight: 500,
            },
        },
        color: ['#5ba7fe'],
        xAxis: {
            type: 'time',
            name: t({
                context: 'Chart axis label',
                message: 'Date',
            }),
            axisLine: {
                show: true,
                lineStyle: {
                    color: colors.axisColor,
                },
            },
            axisLabel: {
                formatter: (timestamp) => {
                    return new Intl.DateTimeFormat(locale, {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                    }).format(new Date(timestamp));
                },
            },
        },
        yAxis: {
            type: 'category',
            name: t({
                context: 'Chart axis label',
                message: 'Rank',
            }),
            axisLabel: {
                rich: richConfig,
                formatter: (value) => {
                    return '{' + value + '| }';
                },
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: colors.splitLineColor,
                },
            },
            axisLine: {
                lineStyle: {
                    color: colors.axisColor,
                },
            },
            data: ranks,
        },
        series: [
            {
                type: 'line',
                data: competitiveRankHistory.map((history) => {
                    return [history.matchDate, history.rank, history.oldRank, history.winCount];
                }),
                label: {
                    show: true,
                    color: colors.labelTextColor,
                },
            },
        ],
    };
    const { ref } = useChart({
        option,
    });
    return React.createElement("div", { className: "min-h-[800px]", ref: ref });
}
//# sourceMappingURL=player-competitive-rank-history.js.map