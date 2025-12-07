import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { RegistrationService } from '#uht-herisau/services/registration-service';
import { RegistrationSchema, type Registration, getDefaultFormValues } from '#uht-herisau/utils/registration.utils';
import { type Price, type RegistrationContent } from '#uht-herisau/utils/strapi.utils';
import { Button } from '../shadcn/button';
import { Form } from '../shadcn/form';
import Persona from './parts/Persona';
import SingleCheck from './parts/SingleCheck';
import Survey from './parts/Survey';
import Team from './parts/Team';
import Terms from './parts/Terms';

type FormProps = {
  isFaesslicupAvailable: boolean;
  categoryOptions?: { label: string; value: string }[];
  surveyOptions?: { label: string; value: string }[];
  price: Price;
  faessliCup: RegistrationContent['faesslicup'];
  terms: RegistrationContent['checks'];
};

export const getErrors = (name: keyof Registration | `players.${number}.${string}` | `termsAcceptance.${number}`, errors: any) => {
  //early return if no errors
  if (Object.keys(errors).length === 0) {
    return undefined;
  }

  const [field, index, subfield] = name.split('.');
  const errorMessage =
    field && index && subfield
      ? errors?.[field]?.[index]?.[subfield]?.message
      : field && index
        ? errors?.[field]?.[index]?.message
        : errors?.[field!]?.message;
  return errorMessage && <p className='text-red-500 h-fit m-0 whitespace-normal'>{errorMessage}</p>;
};

const SignupForm = ({ terms, categoryOptions, price, isFaesslicupAvailable, faessliCup, surveyOptions }: FormProps) => {
  const form = useForm<Registration>({
    defaultValues: getDefaultFormValues(terms.length),
    resolver: zodResolver(RegistrationSchema),
    mode: 'onSubmit',
  });
  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: Registration) => {
    // Todo send data to server
    await new RegistrationService()
      .addNewRegistration(data)
      .then(() => {
        form.reset();
        alert('Anmeldung erfolgreich');
      })
      .catch((e) => {
        console.error(e);
        alert('Anmeldung fehlgeschlagen');
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='px-4 pb-4 overflow-hidden'>
        <Persona control={form.control} />
        <Team control={form.control} selectOtions={categoryOptions} />
        <SingleCheck
          placeholder={price.label}
          control={form.control}
          title='Erinnerungspreis'
          description={price.description}
          name='erinnerungspreis'
        />
        {isFaesslicupAvailable && (
          <SingleCheck
            placeholder={faessliCup.label}
            control={form.control}
            title='Fässlicup'
            description={faessliCup.text}
            name='faesslicup'
          />
        )}
        <Survey selectOtions={surveyOptions} control={form.control} />
        <Terms termsArray={terms} control={form.control} />

        <Button className='mt-2 block' type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Sende...' : 'Anmelden'}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
