import React, {} from 'react';
import clsx from 'clsx';
import { Trans } from '@lingui/react/macro';
import { useSecondsToFormattedMinutes } from 'csdm/ui/hooks/use-seconds-to-formatted-minutes';
import { Tags } from 'csdm/ui/components/tags/tags';
import { getTeamScoreClassName } from 'csdm/ui/styles/get-team-score-class-name';
import { useFormatDate } from 'csdm/ui/hooks/use-format-date';
import { useGetMapThumbnailSrc } from 'csdm/ui/maps/use-get-map-thumbnail-src';
import { MatchCommentInput } from 'csdm/ui/match/match-comment-input';
import { useGetDemoSourceName } from 'csdm/ui/demos/use-demo-sources';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { ChecksumsTagsDialog } from 'csdm/ui/dialogs/checksums-tags-dialog';
function TeamScores({ teamNameA, teamNameB, scoreTeamA, scoreTeamB }) {
    return (React.createElement("div", { className: "flex items-center" },
        React.createElement("p", { className: clsx('selectable text-subtitle', getTeamScoreClassName(scoreTeamA, scoreTeamB)) }, scoreTeamA),
        React.createElement("p", { className: "ml-4 selectable text-gray-900" }, teamNameA),
        React.createElement("p", { className: "mx-4" },
            React.createElement(Trans, { context: "Versus" }, "vs")),
        React.createElement("p", { className: "mr-4 selectable text-gray-900" }, teamNameB),
        React.createElement("p", { className: clsx('selectable text-subtitle', getTeamScoreClassName(scoreTeamB, scoreTeamA)) }, scoreTeamB)));
}
function Field({ name, value }) {
    return (React.createElement("div", { className: "flex items-center" },
        React.createElement("p", { className: "shrink-0" }, name),
        React.createElement("p", { className: "ml-8 selectable break-all text-gray-900" }, value)));
}
export function MatchInformation({ match }) {
    const secondsToFormattedMinutes = useSecondsToFormattedMinutes();
    const formatDate = useFormatDate();
    const getMapThumbnailSrc = useGetMapThumbnailSrc();
    const getDemoSourceName = useGetDemoSourceName();
    const { showDialog } = useDialog();
    const onEditTagsClick = () => {
        showDialog(React.createElement(ChecksumsTagsDialog, { checksums: [match.checksum], defaultTagIds: match.tagIds }));
    };
    return (React.createElement("div", { className: "flex" },
        React.createElement("img", { src: getMapThumbnailSrc(match.mapName, match.game), alt: match.mapName, className: "mr-8 h-[124px]" }),
        React.createElement("div", { className: "flex shrink-0 flex-col" },
            React.createElement("p", { className: "selectable text-gray-900" }, match.mapName),
            React.createElement(TeamScores, { teamNameA: match.teamA.name, teamNameB: match.teamB.name, scoreTeamA: match.teamA.score, scoreTeamB: match.teamB.score }),
            React.createElement("p", { className: "selectable" }, formatDate(match.date)),
            React.createElement("p", { className: "selectable" }, secondsToFormattedMinutes(match.duration)),
            React.createElement(Tags, { tagIds: match.tagIds, onEditClick: onEditTagsClick })),
        React.createElement("div", { className: "ml-16 flex w-full flex-col" },
            React.createElement(Field, { name: React.createElement(Trans, null, "Source"), value: getDemoSourceName(match.source) }),
            React.createElement(Field, { name: React.createElement(Trans, null, "Name"), value: match.name }),
            React.createElement(Field, { name: React.createElement(Trans, null, "Client name"), value: match.clientName }),
            React.createElement(Field, { name: React.createElement(Trans, null, "Server name"), value: match.serverName }),
            React.createElement("div", { className: "flex items-center gap-x-12" },
                React.createElement(Field, { name: React.createElement(Trans, null, "Tickrate"), value: Math.round(match.tickrate) }),
                React.createElement(Field, { name: React.createElement(Trans, null, "Framerate"), value: Math.round(match.frameRate) })),
            React.createElement(Field, { name: React.createElement(Trans, null, "Checksum"), value: match.checksum })),
        React.createElement("div", { className: "ml-16 max-h-[126px] w-full" },
            React.createElement(MatchCommentInput, { isResizable: false }))));
}
//# sourceMappingURL=match-information.js.map