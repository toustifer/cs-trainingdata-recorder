import React from 'react';
import { useLingui } from '@lingui/react/macro';
import { differenceInDays } from 'date-fns';
import { subtractDateDays } from 'csdm/common/date/subtract-date-days';
import { FilterValue } from 'csdm/ui/components/dropdown-filter/filter-value';
import { useFormatDate } from 'csdm/ui/hooks/use-format-date';
import { addDateDays } from 'csdm/common/date/add-date-days';
import { DatePicker } from '../date-picker';
import { ActiveFilterIndicator } from './active-filter-indicator';
function usePeriodPresets() {
    const { t } = useLingui();
    const allTime = {
        name: 'all-time',
        label: t({
            context: 'Period filter preset',
            message: 'All time',
        }),
        daysAgo: undefined,
    };
    const presets = [
        allTime,
        {
            name: 'today',
            label: t({
                context: 'Period filter preset',
                message: 'Today',
            }),
            daysAgo: 0,
        },
        {
            name: 'last-week',
            label: t({
                context: 'Period filter preset',
                message: 'Last week',
            }),
            daysAgo: 7,
        },
        {
            name: 'last-month',
            label: t({
                context: 'Period filter preset',
                message: 'Last month',
            }),
            daysAgo: 30,
        },
        {
            name: 'last-3-month',
            label: t({
                context: 'Period filter preset',
                message: 'Last 3 month',
            }),
            daysAgo: 90,
        },
        {
            name: 'last-year',
            label: t({
                context: 'Period filter preset',
                message: 'Last year',
            }),
            daysAgo: 365,
        },
        {
            name: 'last-2-years',
            label: t({
                context: 'Period filter preset',
                message: 'Last 2 years',
            }),
            daysAgo: 365 * 2,
        },
        {
            name: 'last-5-years',
            label: t({
                context: 'Period filter preset',
                message: 'Last 5 years',
            }),
            daysAgo: 365 * 5,
        },
    ];
    return { presets, allTime };
}
function Footer({ startDate, endDate, selectedPreset, onPresetClick, showFilterIndicator = true }) {
    const { presets } = usePeriodPresets();
    const formatDate = useFormatDate();
    return (React.createElement("div", { className: "mt-8 flex flex-col gap-y-8" },
        React.createElement("div", { className: "flex max-w-[270px] flex-wrap gap-8" }, presets.map((preset) => {
            const onClick = () => {
                onPresetClick(preset);
            };
            const isSelected = selectedPreset?.name === preset.name;
            return (React.createElement(FilterValue, { key: preset.name, isSelected: isSelected, onClick: onClick },
                React.createElement("span", null, preset.label)));
        })),
        startDate && endDate && (React.createElement("div", { className: "flex items-center gap-x-8" },
            React.createElement("div", null,
                React.createElement("span", null, formatDate(startDate, { year: 'numeric', month: 'numeric', day: 'numeric' })),
                React.createElement("span", null, " - "),
                React.createElement("span", null, formatDate(endDate, { year: 'numeric', month: 'numeric', day: 'numeric' }))),
            showFilterIndicator && React.createElement(ActiveFilterIndicator, null)))));
}
export function PeriodFilter({ isDisabled, startDate, endDate, onRangeChange, showFilterIndicator }) {
    const { presets, allTime } = usePeriodPresets();
    let selectedPreset = allTime;
    if (startDate) {
        const diffDays = Math.abs(differenceInDays(startDate, new Date()));
        selectedPreset = presets.find((preset) => {
            return preset.daysAgo !== undefined && Math.abs(preset.daysAgo - diffDays) === 0;
        });
    }
    const onPresetClick = (preset) => {
        if (isDisabled) {
            return;
        }
        if (preset.daysAgo === undefined) {
            onRangeChange(undefined);
            return;
        }
        const now = new Date();
        const newFrom = subtractDateDays(now, preset.daysAgo);
        const newTo = addDateDays(now, 1);
        onRangeChange({
            from: newFrom,
            to: newTo,
        });
    };
    return (React.createElement(DatePicker, { startDate: startDate, endDate: endDate, isDisabled: isDisabled, onRangeChange: onRangeChange, footer: React.createElement(Footer, { startDate: startDate, endDate: endDate, selectedPreset: selectedPreset, onPresetClick: onPresetClick, showFilterIndicator: showFilterIndicator }) }));
}
//# sourceMappingURL=period-filter.js.map