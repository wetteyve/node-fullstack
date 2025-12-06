import { type Control } from 'react-hook-form';
import { type Registration } from '#uht-herisau/utils/registration.utils';
import CustomFormItem from '../CustomFormItem';

export type FormPartProps = {
  control: Control<Registration, unknown>;
};

const Persona = ({ control }: FormPartProps) => (
  <section className='flex flex-col gap-y-2 border-b py-4'>
    <h3 className='font-semibold'>Angaben Spielführer:in</h3>
    <div className='flex gap-x-4 flex-wrap'>
      <CustomFormItem name='captain.firstname' control={control} placeholder='Vorname *' />
      <CustomFormItem name='captain.lastname' control={control} placeholder='Nachname *' />
    </div>
    <div className='flex gap-x-4 flex-wrap'>
      <CustomFormItem name='captain.street' control={control} placeholder='Strasse *,' />
      <CustomFormItem name='captain.place' control={control} placeholder='Ort, PLZ *' />
    </div>
    <div className='flex gap-x-4 flex-wrap'>
      <CustomFormItem name='captain.phone' control={control} placeholder='Telefon *' />
      <CustomFormItem name='captain.email' control={control} placeholder='Email *' type='email' />
    </div>
  </section>
);

export default Persona;
