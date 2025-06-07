import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type DownloadBody, DownloadSchema } from '#app/routes/node.v1.api+/uht-registration+/download-registrations';
import { Button } from '#uht-herisau/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '#uht-herisau/components/ui/form';
import { Input } from '#uht-herisau/components/ui/input';
import { RegistrationService } from '#uht-herisau/services/registration-service';

// Function to download data to a file
const download = (data: any, filename: any, type: any) => {
  const file = new Blob([data], { type: type });
  // Others
  const a = document.createElement('a'),
    url = URL.createObjectURL(file);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
};

export const DownloadRepresentation = () => {
  const form = useForm<DownloadBody>({
    defaultValues: { downloadKey: '' },
    mode: 'onSubmit',
    resolver: zodResolver(DownloadSchema),
  });
  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: DownloadBody) => {
    // Todo send data to server
    await new RegistrationService()
      .downloadRegistrations(data)
      .then((registrations) => {
        const csvString = [
          ['ID', 'Teamname', 'Kategorie', 'Name', 'Vorname', 'Strasse', 'Ort', 'Tel', 'E-mail'],
          ...registrations.map(
            ({
              id,
              attributes: {
                team_name,
                category,
                captain: { lastname, firstname, street, place, phone, email },
              },
            }) => [id, team_name, category, lastname, firstname, street, place, phone, email]
          ),
        ]
          .map((e) => e.join(','))
          .join('\n');
        form.reset();
        // Download the CSV file
        download(csvString, 'registrations.csv', 'text/csv');
      })
      .catch((e) => {
        console.error(e);
        alert('Download fehlgeschlagen');
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='downloadKey'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type='password' placeholder='Password' className='text-primary' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant='secondary' className='mt-2 w-full' type='submit' disabled={isSubmitting}>
          Download
        </Button>
      </form>
    </Form>
  );
};
