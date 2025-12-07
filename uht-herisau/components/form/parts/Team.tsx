import { useFieldArray } from 'react-hook-form';
import { PiMinus, PiPlus } from 'react-icons/pi';
import CustomFormItem from '#uht-herisau/components/form/CustomFormItem';
import { type FormSelectProps } from '#uht-herisau/components/form/parts/Survey';
import { Button } from '#uht-herisau/components/shadcn/button';
import { EMPTY_PLAYER } from '#uht-herisau/utils/registration.utils';

const Team = ({ control, selectOtions }: FormSelectProps) => {
  const { fields: teammates, append, remove } = useFieldArray({ control, name: 'teammates' });

  return (
    <section className='flex flex-col gap-y-2 border-b py-4'>
      <h3>Angaben zum Team</h3>
      <div className='flex gap-x-4 flex-wrap'>
        <CustomFormItem name='team_name' control={control} placeholder='Teamname' />
        <CustomFormItem name='category' control={control} placeholder='Kategorie' type='select' options={selectOtions} />
      </div>
      <>
        <span>Bitte erfasse min. 4 Spieler:innen</span>
        {teammates.map((player, index) => (
          <div key={player.id} className='flex gap-x-4 flex-wrap'>
            <CustomFormItem name={`teammates.${index}.firstname`} control={control} placeholder='Vorname' />
            <CustomFormItem name={`teammates.${index}.lastname`} control={control} placeholder='Nachname' />
            <CustomFormItem name={`teammates.${index}.year_of_birth`} control={control} placeholder='Geburtsjahr' type='number' />
            <CustomFormItem name={`teammates.${index}.is_licenced`} control={control} placeholder='Ist Lizenziert' type='checkbox' />
            {index > 3 && (
              <PiMinus
                role='button'
                className='mt-2 border size-5 border-gray-200 ring-offset-white rounded-sm'
                onClick={() => remove(index)}
              />
            )}
          </div>
        ))}
        {teammates.length < 7 && (
          <Button variant='secondary' type='button' className='w-[232px]!' onClick={() => append(EMPTY_PLAYER)}>
            <PiPlus />
            Mitspieler:in hinzufügen
          </Button>
        )}
      </>
    </section>
  );
};

export default Team;
