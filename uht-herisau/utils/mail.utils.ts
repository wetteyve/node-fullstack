import axios from 'axios';
import { format } from 'date-fns';
import { imagesBasePath } from '#app/utils/path';
import { createResend } from '#app/utils/server/mail.server';
import { getReqConfig } from '#uht-herisau/utils/api.utils';
import { fetchStrapiCategories, fetchStrapiContentById } from '#uht-herisau/utils/page.utils';
import { type Registration } from '#uht-herisau/utils/registration.utils';
import { type Price, type RegistrationContent } from './strapi.utils';

const qrImagePath = `https://uht-herisau.ch${imagesBasePath}/qr-konto.png`;

const fetchStrapiEmailData = async () => {
  const config = getReqConfig('email');

  return axios
    .request(config)
    .then(async (response: { data: { data: { attributes: { start_date: string; end_date: string; edition_nr: number } } } }) => {
      //transform the data to the format we need
      return response.data.data.attributes;
    });
};

export const createMailToUhtRegistrar = (
  registrationObject: Registration,
  emailData: Awaited<ReturnType<typeof fetchStrapiEmailData>>,
  categories: Awaited<ReturnType<typeof fetchStrapiCategories>>,
  erinnerungsPreis: Price
) => {
  const { edition_nr, end_date, start_date } = emailData;
  const start = new Date(start_date);
  const startDate = format(start, 'dd');
  const endDate = format(new Date(end_date), 'dd');
  const year = start.getFullYear();
  const month = format(start, 'LL');
  const shortKey = registrationObject.category.split(' ')[0] || registrationObject.category;

  let price = categories.find((element) => element.short_key === shortKey)?.price || 0;
  const erinnerungspreisNotFree =
    registrationObject.erinnerungspreis && erinnerungsPreis.paidCat.data.map((c) => c.attributes.short_key).includes(shortKey);
  if (erinnerungspreisNotFree) price = price + erinnerungsPreis.cost;

  let playersForMail = '';
  for (const player of registrationObject.teammates) {
    const istLizenzspieler = player.is_licenced ? 'ja' : 'nein';
    playersForMail =
      playersForMail +
      `<li>${player.firstname} ${player.lastname}, Jahrgang: ${player.year_of_birth}, Lizenziert: ${istLizenzspieler}</li>`;
  }

  const faesslicupForMail = registrationObject.faesslicup ? 'ja' : 'nein';
  const erinnerungspreisForMail =
    erinnerungspreisNotFree && registrationObject.erinnerungspreis
      ? `ja (${erinnerungsPreis.cost} CHF)`
      : registrationObject.erinnerungspreis
        ? 'ja'
        : 'nein';

  return {
    from: '"UHT-Herisau" <info@uht-herisau.ch>',
    to: [registrationObject.captain.email],
    subject: 'Neue Anmeldung für das Unihockeyturnier Herisau',
    attachments: [
      {
        filename: 'qr-konto.png',
        path: qrImagePath,
        cid: 'qr-in-mail',
      },
    ],
    html: `<b>Liebe/r ${registrationObject.captain.firstname}</b>
      <br><br>
      Vielen Dank für deine Anmeldung für das ${edition_nr}. Unihockeyturnier Herisau.
      <br><br>
      Gerne bestätigen wir die Anmeldung deines Teams:<br>
      ${registrationObject.team_name}, ${registrationObject.category}, Fässlicup: ${faesslicupForMail}, Erinnerungspreis: ${erinnerungspreisForMail}<br>
      ${playersForMail}
      <br><br>
      Wir bedanken uns für eine fristgerechte Bezahlung des Turnierbeitrages von ${price} CHF und freuen uns jetzt schon, euch am ${startDate}./${endDate}.${month}.${year} im Sportzentrum Herisau begrüssen zu dürfen.
      <br><br>
      Verwende für die Bezahlung bitte den angehängten QR-Code oder überweise den Turnierbeitrag auf folgendes Konto:
      <br><br>
      Einzahlung für: St. Galler Kantonalbank, 9100 Herisau<br>
      Zugunsten von:<br>
      CH70 0078 1015 5374 3420 9<br>
      Unihockeyturnier Herisau<br>
      9100 Herisau<br><br>
      Zahlungsgrund: Mannschaftsname und Kategorie angeben!
      <br><br>
      <li><em>Ich bestätige mit der Anmeldung, dass ich den Turnierbatzen bis spätestens zwei Tage vor dem Turnier überwiesen habe. Bei kürzeren Zahlungsfristen oder Zahlungen am Turniertag, wird zusätzlich eine Unkostenpauschale von CHF 10.00 erhoben.</em><br></li>
      <li><em>Ich bestätige mit der Anmeldung die folgende Abmelderegelung: Abmeldungen bis 14 Tage vor Turnier sind kostenfrei möglich und schriftlich an info@uht-herisau.ch zu kommunizieren. Bei einer späteren Abmeldung oder im Falle eines No-Shows am Turnier werden 100 % des Turnierbetrags in Rechnung gestellt.</em><br></li>
      <li><em>Ich bestätige mit der Anmeldung, dass die Turnierfotos vom Turniertag für den Web-Auftritt der Homepage und in den Sozialen Medien genutzt werden dürfen.</em><br></li>
      <br><br>
      <b>Sportliche Grüsse</b><br>
      <b>OK Unihockeyturnier Herisau</b>
      <br><br>
      QR-Code (für Zahlung via e-banking - nicht TWINT):
      <img src='cid:qr-in-mail' />`,
  };
};

export const sendEmailToRegistrar = async (registration: Registration) => {
  const [emailData, categories, registrationPage] = await Promise.all([
    fetchStrapiEmailData(),
    fetchStrapiCategories(),
    fetchStrapiContentById(10),
  ]);
  const { price } = registrationPage.content as RegistrationContent;
  //const transporter = createTransporter('uht');
  const resend = createResend('uht');
  const { error } = await resend.emails.send(createMailToUhtRegistrar(registration, emailData, categories, price));
  if (error) {
    console.error('Error sending email to registrar:', error);
    throw new Error('Failed to send email to registrar');
  }

  // await transporter.sendMail(createMailToUhtRegistrar(registration, emailData, categories, price));
};
