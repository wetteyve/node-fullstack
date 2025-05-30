import { type Registration } from '#uht-herisau/utils/registration.utils';
import CustomFormItem from '../CustomFormItem';
import { type FormPartProps } from './Persona';

type FormCheckProps = FormPartProps & {
  title: string;
  placeholder?: string;
  description: string;
  name: keyof Registration;
};

const SingleCheck = ({ control, placeholder, description, title, name }: FormCheckProps) => {
  return (
    <section className='flex flex-col gap-y-2 border-b-[1px] py-4'>
      <h3>{title}</h3>
      <div className='flex gap-x-4'>
        <CustomFormItem name={name} control={control} type='checkbox' placeholder={placeholder} description={description} />
      </div>
    </section>
  );
};

export default SingleCheck;
