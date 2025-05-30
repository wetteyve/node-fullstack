import clsx, { type ClassValue } from 'clsx';
import React from 'react';
import { Image } from '#uht-herisau/components/building-blocks/Image';
import { type Sponsor } from '#uht-herisau/utils/strapi.utils';

type Props = {
  title: string;
  children: React.ReactNode;
  className?: ClassValue;
};

export const UhtCard = ({ title, children, className }: Props) => (
  <div className={clsx('flex flex-col w-full items-center bg-white rounded-sm text-[#000000D9]', className)}>
    <div className='border-b-[1px] w-full h-[75px]'>
      <h1 className='typo-lg text-center font-semibold py-4'>{title}</h1>
    </div>
    {children}
  </div>
);

export const SponsorCard = ({
  sponsor,
  titleOverride,
  className,
}: {
  sponsor: Sponsor;
  titleOverride?: string;
  className?: ClassValue;
}): React.ReactNode => (
  <UhtCard title={titleOverride ?? sponsor.name} className={className}>
    <div className='p-5 my-auto'>
      <Image file={{ ...sponsor.picture, link: sponsor.url }} twFit='object-contain' />
    </div>
  </UhtCard>
);
