import { type DownloadBody } from '#app/routes/node.v1.api/uht-registration/download-registrations';
import { AxiosBaseService } from '#uht-herisau/services/axios-base.service';
import { type Registration } from '#uht-herisau/utils/registration.utils';

export class RegistrationService extends AxiosBaseService {
  constructor() {
    super('/node/v1/api/uht-registration');
  }

  public async addNewRegistration(newRegistration: Registration): Promise<unknown> {
    return await this.instance.post('/', newRegistration).then(this.responseBody).catch(this.errorHandling);
  }

  public async downloadRegistrations({ downloadKey }: DownloadBody): Promise<{ id: number; attributes: Registration }[]> {
    return await this.instance.post('/download-registrations', { downloadKey }).then(this.responseBody).catch(this.errorHandling);
  }

  public async getFaesslicount(): Promise<number> {
    return await this.instance.get('/fc-count').then(this.responseBody).catch(this.errorHandling);
  }
}
