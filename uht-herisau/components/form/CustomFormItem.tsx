import { type Registration } from '#uht-herisau/utils/registration.utils';
import StyledMarkdown from '../building-blocks/Markdown';
import { Checkbox } from '../shadcn/checkbox';
import { FormControl, FormField, FormItem, FormMessage } from '../shadcn/form';
import { Input } from '../shadcn/input';
import { type FormPartProps } from './parts/Persona';

type CustomItemProps = {
  control: FormPartProps['control'];
  name:
    | keyof Registration
    | `teammates.${number}.${keyof Registration['teammates'][number]}`
    | `termsAcceptance.${number}`
    | `captain.${keyof Registration['captain']}`;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'checkbox' | 'select';
  options?: { label: string; value: string }[];
  description?: string;
};

const CustomFormItem = ({ control, name, placeholder = 'Enter Response', type = 'text', options = [], description }: CustomItemProps) => {
  function getInput(field: any) {
    switch (type) {
      case 'checkbox':
        field.checked = field.value;
        field.onCheckedChange = field.onChange;
        return (
          <FormControl>
            <div
              className='grid gap-2 min-h-10'
              style={{
                gridTemplateColumns: '20px auto',
                gridTemplateRows: 'auto',
                gridTemplateAreas: `
                    'check label'
                    'none description'
                   `,
              }}
            >
              <Checkbox className='size-5 mt-2.5' style={{ gridArea: 'check' }} id={name} {...field} />
              <label
                className='font-semibold typo-xs h-5 md:h-5.75 mt-2.5 md:mt-[calc((40px-1.4375rem)/2)]'
                style={{ gridArea: 'label' }}
                htmlFor={name}
              >
                {placeholder}
              </label>
              {description && (
                <div style={{ gridArea: 'description' }}>
                  <StyledMarkdown className='p-0' align='text-left' markdown={description} />
                </div>
              )}
            </div>
          </FormControl>
        );
      case 'select':
        return (
          <FormControl>
            <select
              {...field}
              className='flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <option value='' disabled>
                {placeholder}
              </option>
              {options.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </FormControl>
        );
      default:
        return (
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              onChange={(e) => {
                // Convert to number for number inputs
                const value = type === 'number' && e.target.value !== '' ? Number(e.target.value) : e.target.value;
                field.onChange(value);
              }}
            />
          </FormControl>
        );
    }
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {getInput(field)}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomFormItem;
