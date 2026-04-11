'use client';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { useLocalization } from '@/hooks/useLocalization';
import { IBranch } from '@/types/branch';
import dayjs from 'dayjs';

interface ReportHeaderProps {
  /** The selected branch object (from the branches list), or null for "All Branches" */
  selectedBranch?: IBranch | null;
  /** Report title (e.g. "Trial Balance", "Balance Sheet") */
  reportTitle: string;
  /** Date range or "As On" date string */
  dateInfo: string;
  /** Label for the date info (e.g. "For the Period" or "As On") */
  dateLabel?: string;
  /** Currency code for the report (e.g. "SAR") */
  currencyCode?: string;
}

/**
 * Shared print header/footer for all accounting reports.
 * Pulls institute name, branch, address, phone, email, website from the branch object.
 */
export const ReportHeader = ({
  selectedBranch,
  reportTitle,
  dateInfo,
  dateLabel,
  currencyCode,
}: ReportHeaderProps) => {
  const { t } = useLocalization();

  const instituteName = selectedBranch?.institute?.name || t(LOCALE_KEYS.INSTITUTE_NAME);
  const branchName = selectedBranch?.name || t(LOCALE_KEYS.ALL_BRANCHES);

  // Address from branch, fallback to institute address
  const addr = selectedBranch?.address;
  const instAddr = selectedBranch?.institute?.address;
  const addressParts = [
    addr?.address || instAddr?.address,
    addr?.city || instAddr?.city,
    addr?.state || instAddr?.state,
    addr?.country || instAddr?.country,
  ].filter(Boolean);

  const phone = addr?.phone || instAddr?.phone || '';
  const email = addr?.email || instAddr?.email || '';
  const website = selectedBranch?.institute?.website || '';

  return (
    <>
      {/* Print Header */}
      <div className="mb-4 hidden print:block">
        <div className="text-center border-b-2 border-black pb-3 mb-3">
          <div style={{ fontSize: 22, fontWeight: 'bold', margin: 0 }}>{instituteName}</div>
          <div style={{ fontSize: 12, color: '#333' }}>
            {branchName}
            {addressParts.length > 0 ? ` - ${addressParts.join(', ')}` : ''}
          </div>
        </div>

        <div className="text-center mb-3">
          <div style={{ fontSize: 14, fontWeight: 600 }}>{reportTitle}</div>
          {currencyCode && (
            <div style={{ fontSize: 11, fontStyle: 'italic', color: '#555' }}>
              ({t(LOCALE_KEYS.AMOUNTS_IN)} {currencyCode})
            </div>
          )}
          {dateLabel && dateInfo && (
            <div
              className="font-bold border border-black px-4 inline-block mt-1"
              style={{ fontSize: 12 }}
            >
              {dateLabel}: {dateInfo}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/**
 * Shared print footer with signatures and branding for all accounting reports.
 */
export const ReportFooter = ({ selectedBranch }: { selectedBranch?: IBranch | null }) => {
  const { t } = useLocalization();

  const addr = selectedBranch?.address;
  const instAddr = selectedBranch?.institute?.address;

  const phone = addr?.phone || instAddr?.phone || '';
  const email = addr?.email || instAddr?.email || '';
  const website = selectedBranch?.institute?.website || '';

  return (
    <div className="hidden print:block">
      {/* Signatures */}
      <div className="mt-16 flex justify-between w-full px-8">
        <div className="border-t border-black text-center pt-2 px-4" style={{ fontSize: 10 }}>
          {t(LOCALE_KEYS.PREPARED_BY)}
        </div>
        <div className="border-t border-black text-center pt-2 px-4" style={{ fontSize: 10 }}>
          {t(LOCALE_KEYS.CHECKED_BY)}
        </div>
        <div className="border-t border-black text-center pt-2 px-4" style={{ fontSize: 10 }}>
          {t(LOCALE_KEYS.APPROVED_BY)}
        </div>
      </div>

      {/* Branding */}
      <div
        className="mt-4 border-y border-black py-1 px-2 flex justify-between"
        style={{ fontSize: 9 }}
      >
        {phone && <span>{t(LOCALE_KEYS.PHONE)}: {phone}</span>}
        {email && <span>{t(LOCALE_KEYS.EMAIL)}: {email}</span>}
        {website && <span>{t(LOCALE_KEYS.WEBSITE)}: {website}</span>}
        <span>
          {t(LOCALE_KEYS.PRINT_DATE)}: {dayjs().format('DD-MMM-YYYY')}
        </span>
      </div>
    </div>
  );
};
