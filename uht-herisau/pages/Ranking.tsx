import React from 'react';
import { pdfjs } from 'react-pdf';
import { type RankingsContent } from '#uht-herisau/utils/strapi.utils';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

export const RankingRepresentation = ({ pdf }: RankingsContent): React.ReactNode => {
  const {
    show_on_page,
    file: {
      data: {
        attributes: { url },
      },
    },
  } = pdf;

  return (
    show_on_page && (
      <div>
        <iframe src={url} className='w-full h-[calc(100vh-232px)]' />
      </div>
    )
  );
};
