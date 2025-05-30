import CustomFormItem from '../CustomFormItem';
import { type FormPartProps } from './Persona';

export type FormSelectProps = FormPartProps & {
  selectOtions?: { label: string; value: string }[];
};

const Survey = ({ control, selectOtions }: FormSelectProps) => (
  <section className='flex flex-col gap-y-2 border-b-[1px] py-4'>
    <h3>Wie hast du vom UHT Herisau erfahren?</h3>
    <div className='flex gap-x-4'>
      <CustomFormItem name='votingOption' control={control} placeholder='Bitte auswählen' type='select' options={selectOtions} />
    </div>
  </section>
);

export default Survey;
