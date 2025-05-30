import { z } from 'zod';

// VotingOption
export const VOTING_OPTIONS = [
  'Buswerbung',
  'Werbeplakat',
  'Instagram',
  'Zeitung',
  'Letztes Jahr bereits mitgemacht',
  'Freunde/Kollegen',
  'Jungwacht/Blauring',
  'Sonstiges',
] as const;
const VotingOptionSchema = z.enum(VOTING_OPTIONS);
const phoneRegex = new RegExp(/^(\+\d{1,3}\s?)?((\(\d{1,4}\))|\d{1,4})[\s-/]?\d{1,5}[\s-/]?\d{1,5}[\s-/]?\d{1,5}$/);
const REQUIRED_MESSAGE = 'Wird benötigt';
const stringToBoolean = (val: string): boolean => val === 'true';
const zStringBoolean = z.enum(['true', 'false']).transform(stringToBoolean);

// Teammate
const TeammateSchema = z.object({
  firstname: z.string().min(1, { message: REQUIRED_MESSAGE }),
  lastname: z.string().min(1, { message: REQUIRED_MESSAGE }),
  year_of_birth: z.coerce
    .number()
    .min(new Date().getFullYear() - 100, { message: 'Gültigen Jahrgang verwenden' })
    .max(new Date().getFullYear(), { message: 'Gültigen Jahrgang verwenden' }),
  is_licenced: z.boolean().default(false),
});
// Captain
const CaptainSchema = z.object({
  firstname: z.string().min(1, { message: REQUIRED_MESSAGE }),
  lastname: z.string().min(1, { message: REQUIRED_MESSAGE }),
  street: z.string().min(1, { message: REQUIRED_MESSAGE }),
  place: z.string().min(1, { message: REQUIRED_MESSAGE }),
  phone: z.string().regex(phoneRegex, { message: 'Tel.Nr. verwenden' }),
  email: z.string().email({ message: 'Email verwenden' }),
});

// Registration
export const RegistrationSchema = z.object({
  team_name: z.string().min(1, { message: REQUIRED_MESSAGE }),
  category: z.string().min(1, { message: REQUIRED_MESSAGE }),
  captain: CaptainSchema,
  teammates: TeammateSchema.array().min(4).max(7),
  erinnerungspreis: zStringBoolean.default('false'),
  faesslicup: zStringBoolean.default('false'),
  termsAcceptance: z.boolean().array().min(1),
  votingOption: VotingOptionSchema,
});

export type Registration = z.infer<typeof RegistrationSchema>;
export type Teammate = z.infer<typeof TeammateSchema>;
export type VotingOption = z.infer<typeof VotingOptionSchema>;

export const getDefaultFormValues = (termsLength: number): Registration => ({
  team_name: '',
  category: '',
  captain: {
    firstname: '',
    lastname: '',
    street: '',
    place: '',
    phone: '',
    email: '',
  },
  teammates: Array(4).fill(EMPTY_PLAYER),
  erinnerungspreis: false,
  faesslicup: false,
  termsAcceptance: Array(termsLength).fill(false),
  votingOption: VOTING_OPTIONS[0],
});

export const EMPTY_PLAYER: Teammate = {
  firstname: '',
  lastname: '',
  year_of_birth: '' as unknown as number, // Coerce to number later
  is_licenced: false,
};
