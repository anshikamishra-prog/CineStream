import React from 'react';
import { RiCalendarLine, RiTimeLine, RiGlobalLine, RiMoneyDollarCircleLine } from 'react-icons/ri';
import { formatRuntime, formatDate } from '@utils/tmdb.utils.js';
import { formatCurrency } from '@utils/formatters.js';
import Badge from '@components/ui/Badge.jsx';

/**
 * Side-panel information block for MediaDetailPage.
 * Displays structured metadata in a clean key→value layout.
 */
const InfoRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex gap-3 text-sm py-2 border-b border-white/5 last:border-0">
      <span className="text-white/30 w-28 flex-shrink-0">{label}</span>
      <span className="text-white/70 flex-wrap">{value}</span>
    </div>
  );
};

const MediaInfoPanel = ({ media, type }) => {
  if (!media) return null;

  const releaseDate   = media.release_date || media.first_air_date;
  const status        = media.status;
  const originalLang  = media.original_language?.toUpperCase();
  const runtime       = type === 'movie' ? formatRuntime(media.runtime) : null;
  const seasons       = type === 'tv'    ? media.number_of_seasons       : null;
  const budget        = type === 'movie' ? formatCurrency(media.budget)   : null;
  const revenue       = type === 'movie' ? formatCurrency(media.revenue)  : null;
  const networks      = (media.networks || []).map((n) => n.name).join(', ') || null;
  const productionCos = (media.production_companies || [])
    .slice(0, 3)
    .map((c) => c.name)
    .join(', ') || null;

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4">
      <h3 className="font-display text-sm font-bold text-white/40 uppercase tracking-widest mb-3">
        Details
      </h3>

      <div className="divide-y divide-white/0">
        {releaseDate && (
          <InfoRow label="Release" value={formatDate(releaseDate)} />
        )}
        {status && (
          <div className="flex gap-3 text-sm py-2 border-b border-white/5">
            <span className="text-white/30 w-28 flex-shrink-0">Status</span>
            <Badge variant={status === 'Released' || status === 'Ended' ? 'default' : 'success'}>
              {status}
            </Badge>
          </div>
        )}
        {runtime && <InfoRow label="Runtime" value={runtime} />}
        {seasons  && <InfoRow label="Seasons" value={String(seasons)} />}
        {originalLang && <InfoRow label="Language" value={originalLang} />}
        {networks && <InfoRow label="Network" value={networks} />}
        {budget   && budget !== 'N/A'  && <InfoRow label="Budget"  value={budget} />}
        {revenue  && revenue !== 'N/A' && <InfoRow label="Revenue" value={revenue} />}
        {productionCos && <InfoRow label="Studio" value={productionCos} />}
      </div>
    </div>
  );
};

export default MediaInfoPanel;
