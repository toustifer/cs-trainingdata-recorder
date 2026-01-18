import React from 'react';
import { getPremierRankTier } from '../shared/get-premier-rank-tier';
import { CompetitiveRank } from 'csdm/common/types/counter-strike';
export function PremierRank({ rank }) {
    const tier = getPremierRankTier(rank);
    const [major, minor] = new Intl.NumberFormat('en-US').format(rank).toString().split(',');
    if (rank === CompetitiveRank.Unknown) {
        return React.createElement("img", { src: window.csdm.getRankImageSrc(CompetitiveRank.Unknown) });
    }
    return (React.createElement("div", { className: "relative flex size-full", style: {
            color: `var(--cs-rating-tier-${tier})`,
        } },
        React.createElement("svg", { viewBox: "0 0 178 64", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: "w-full" },
            React.createElement("g", null,
                React.createElement("path", { d: "M12 0H20L8 64H0L12 0Z", fill: "currentColor" }),
                React.createElement("path", { d: "M18 0H27L18 64H3.25L18 0Z", fill: "currentColor", fillOpacity: 0.5 }),
                React.createElement("path", { d: "M25 0H33L21 64H13L25 0Z", fill: "currentColor" }),
                React.createElement("path", { opacity: "0.4", d: "M46.1141 4L54 4L40.8859 61H33L46.1141 4Z", fill: "currentColor", fillOpacity: 0.2 }),
                React.createElement("path", { opacity: "0.4", d: "M56.8737 4L72 4L59.1263 61H44L56.8737 4Z", fill: "currentColor", fillOpacity: 0.2 }),
                React.createElement("path", { opacity: "0.4", d: "M75.7813 4L110 4L97.2187 61H63L75.7813 4Z", fill: "currentColor", fillOpacity: 0.2 }),
                React.createElement("path", { d: "M178 0H33.9996L22 64H166L178 0Z", fill: "currentColor", fillOpacity: 0.44 }),
                React.createElement("path", { d: "M176.25 1.5H33.24L21.6562 62.5H164.666L176.25 1.5Z", fill: `url(#background-${tier})` })),
            React.createElement("defs", null, Array.from({ length: 6 }).map((value, index) => {
                const color = `var(--cs-rating-tier-${index})`;
                const id = `background-${index}`;
                return (React.createElement("linearGradient", { key: index, id: id, x1: "185.411", y1: "47.9446", x2: "26.5628", y2: "33.7951", gradientUnits: "userSpaceOnUse" },
                    React.createElement("stop", { offset: "0.862691", stopColor: color, stopOpacity: "0" }),
                    React.createElement("stop", { offset: "1", stopColor: color, stopOpacity: 0.7 })));
            }))),
        React.createElement("div", { className: "absolute top-0 left-0 ml-[14px] flex h-full items-center" },
            React.createElement("p", { className: "-skew-x-12 text-[14px] font-semibold brightness-[1.7] [text-shadow:_1px_1px_black]" },
                major === '0' ? '---' : major,
                minor !== undefined && React.createElement("small", { className: "text-[10px]" }, `,${minor}`)))));
}
//# sourceMappingURL=premier-rank.js.map