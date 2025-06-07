import { type Registration } from '#uht-herisau/utils/registration.utils';
import StyledMarkdown from '../building-blocks/Markdown';
import { Checkbox } from '../ui/checkbox';
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
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
              <Checkbox className='size-5 mt-[10px]' style={{ gridArea: 'check' }} id={name} {...field} />
              <label
                className='font-semibold typo-xs h-[1.25rem] md:h-[1.4375rem] mt-[10px] md:mt-[calc((40px-1.4375rem)/2)]'
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
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
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
