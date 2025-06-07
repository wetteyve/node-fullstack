import React, { useEffect, useState } from 'react';
import StyledMarkdown from '#uht-herisau/components/building-blocks/Markdown';
import { UhtCard } from '#uht-herisau/components/building-blocks/UhtCard';
import SignupForm from '#uht-herisau/components/form/SignupForm';
import { RegistrationService } from '#uht-herisau/services/registration-service';
import { VOTING_OPTIONS } from '#uht-herisau/utils/registration.utils';
import { type Category, type RegistrationContent } from '#uht-herisau/utils/strapi.utils';

const extractCategoriesSelectOptions = (categoriesArray: Category[]) => {
  const optionsArray = categoriesArray.map((categorie) => {
    return {
      label: `${categorie.short_key} ${categorie.name}`,
      value: `${categorie.short_key} ${categorie.name}`,
    };
  });
  return optionsArray.filter((element) => element.value !== 'FC Fässlicup');
};

const surveyOptions = VOTING_OPTIONS.map((option) => ({
  label: option,
  value: option,
}));

const RegistrationRepresentation = ({
  categories,
  allow_registration,
  checks,
  faesslicup,
  price,
}: RegistrationContent & { categories: Category[] }) => {
  const categoryOptions = extractCategoriesSelectOptions(categories);
  const [isFaesslicupAvailable, setIsFaesslicupAvailable] = useState<boolean>(false);

  useEffect(() => {
    const registrationService = new RegistrationService();
    void registrationService.getFaesslicount().then((faessliCount) => {
      const faessliCupMaxTeams = categories.find((element) => element.short_key === 'FC')?.max_teams || 16;
      setIsFaesslicupAvailable(faessliCount < 2 * faessliCupMaxTeams);
    });
  }, [categories]);

  return (
    <section>
      <UhtCard className='mb-5' title='Anmeldung'>
        {allow_registration ? (
          <SignupForm
            surveyOptions={surveyOptions}
            categoryOptions={categoryOptions}
            isFaesslicupAvailable={isFaesslicupAvailable}
            price={price}
            faessliCup={faesslicup}
            terms={checks}
          />
        ) : (
          <StyledMarkdown
            align='text-left'
            markdown={`Die Anmeldung für das UHT Herisau ist aktuell nicht möglich. Sobald das Anmeldefenster geöffnet wird kannst du dich hier registrieren.`}
          />
        )}
      </UhtCard>
    </section>
  );
};

export default RegistrationRepresentation;
