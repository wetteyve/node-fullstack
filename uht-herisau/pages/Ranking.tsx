import React from 'react';
import { type RankingsContent } from '#uht-herisau/utils/strapi.utils';

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
