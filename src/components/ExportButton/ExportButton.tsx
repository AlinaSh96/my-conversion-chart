import React, { useState, type RefObject } from 'react';
import { toPng } from 'html-to-image';
import { makeT } from '../../constants/translations';

const t = makeT('en');

type ExportButtonProps = {
  targetRef: RefObject<HTMLDivElement | null>;
  fileName?: string;
  disabled?: boolean;
};

const ExportButton: React.FC<ExportButtonProps> = ({ targetRef, fileName = 'conversion-chart.png', disabled }) => {
  const [busy, setBusy] = useState(false);

  const handleExport = async () => {
    if (!targetRef.current || busy) return;
    try {
      setBusy(true);
      const dataUrl = await toPng(targetRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        skipFonts: false,
      });

      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Failed to export chart:', e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button onClick={handleExport} disabled={disabled || busy} aria-label={t('exportPng')}>
      {busy ? 'Exporting…' : t('exportPng')}
    </button>
  );
};

export default React.memo(ExportButton);
