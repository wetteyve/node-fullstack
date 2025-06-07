import { type DownloadBody } from '#app/routes/node.v1.api+/uht-registration+/download-registrations';
import { type Registration } from '#uht-herisau/utils/registration.utils';
import { AxiosBaseService } from './axios-base.service';

export class RegistrationService extends AxiosBaseService {
  constructor() {
    super('/node/v1/api/uht-registration');
  }

  public async addNewRegistration(newRegistration: Registration): Promise<unknown> {
    return await this.instance.post('/', newRegistration).then(this.responseBody).catch(this.errorHandling);
  }

  public async downloadRegistrations({ downloadKey }: DownloadBody): Promise<{ id: number; attributes: Registration }[]> {
    console.log('Download key:', downloadKey);
    return await this.instance.post('/download-registrations', { downloadKey }).then(this.responseBody).catch(this.errorHandling);
  }

  public async getFaesslicount(): Promise<number> {
    return await this.instance.get('/fc-count').then(this.responseBody).catch(this.errorHandling);
  }
}
