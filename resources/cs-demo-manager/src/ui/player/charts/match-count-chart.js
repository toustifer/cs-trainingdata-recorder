import React from 'react';
import { useLingui } from '@lingui/react/macro';
import { dateToUnixTimestamp } from 'csdm/common/date/date-to-unix-timestamp';
import { getDateFirstDay } from 'csdm/common/date/get-date-first-day';
import { getDateFirstMonth } from 'csdm/common/date/get-date-first-month';
import { getDateTimestampAtMidnight } from 'csdm/common/date/get-date-timestamp-at-midnight';
import { usePlayerChartOptions } from './use-player-chart-options';
import { useChart } from 'csdm/ui/hooks/use-chart';
import { usePlayer } from '../use-player';
import { assertNever } from 'csdm/common/assert-never';
function buildChartData({ chartsData, axis }) {
    const valuePerTimestamp = {};
    for (const chartData of chartsData) {
        const matchDate = new Date(chartData.matchDate);
        let timestamp;
        switch (axis) {
            case 'match':
                timestamp = dateToUnixTimestamp(matchDate);
                break;
            case 'day':
                timestamp = getDateTimestampAtMidnight(matchDate);
                break;
            case 'month': {
                const firstDay = getDateFirstDay(matchDate);
                timestamp = dateToUnixTimestamp(firstDay);
                break;
            }
            case 'year': {
                const firstMonth = getDateFirstMonth(matchDate);
                timestamp = dateToUnixTimestamp(firstMonth);
                break;
            }
            default:
                assertNever(axis, `Unsupported axis: ${axis}`);
        }
        if (valuePerTimestamp[timestamp] === undefined) {
            valuePerTimestamp[timestamp] = 1;
        }
        else {
            valuePerTimestamp[timestamp]++;
        }
    }
    const data = [...Object.entries(valuePerTimestamp)];
    return data;
}
export function MatchCountChart({ axis }) {
    const { chartsData } = usePlayer();
    const { t } = useLingui();
    const data = buildChartData({ chartsData, axis });
    const firstValue = data.length > 0 ? data[0][1] : 0;
    let maxValue = firstValue;
    let minValue = firstValue;
    for (const tuple of data) {
        if (tuple[1] > maxValue) {
            maxValue = tuple[1];
        }
        if (tuple[1] < minValue) {
            minValue = tuple[1];
        }
    }
    const chartOptions = usePlayerChartOptions({
        axis,
        data,
        minValue: Math.max(0, minValue - 0.5),
        maxValue: maxValue + 0.5,
        title: t({
            context: 'Chart title',
            message: 'Number of matches played over time',
        }),
        name: t({
            context: 'Chart axis label match count',
            message: 'Match',
        }),
        yLineParallelToXAxisValue: (maxValue + minValue) / 2,
    });
    const { ref } = useChart({
        option: chartOptions,
    });
    return React.createElement("div", { className: "h-[352px] w-full", ref: ref });
}
//# sourceMappingURL=match-count-chart.js.map