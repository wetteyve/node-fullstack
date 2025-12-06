import { type RegistrationContent } from '#uht-herisau/utils/strapi.utils';
import CustomFormItem from '../CustomFormItem';
import { type FormPartProps } from './Persona';

type FormTermsProps = FormPartProps & { termsArray: RegistrationContent['checks'] };

const Terms = ({ control, termsArray }: FormTermsProps) => {
  return (
    <section className='flex flex-col gap-y-2 border-b py-4'>
      <h3>UHT Bestimmungen</h3>
      {termsArray.map((term, index) => (
        <div key={term.id} className='flex gap-x-4'>
          <CustomFormItem name={`termsAcceptance.${index}`} control={control} placeholder={term.text} type='checkbox' />
        </div>
      ))}
    </section>
  );
};

export default Terms;
