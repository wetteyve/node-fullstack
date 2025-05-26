import { z } from 'zod';

// VotingOption
const VOTING_OPTIONS = [
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

const stringToBoolean = (val: string): boolean => val === 'true';
const zStringBoolean = z.enum(['true', 'false']).transform(stringToBoolean);
// Teammate
const TeammateSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  year_of_birth: z.coerce.number(),
  is_licenced: z.boolean(),
});
// Captain
const CaptainSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  street: z.string().min(1),
  place: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
});

// Registration
export const RegistrationSchema = z.object({
  team_name: z.string().min(1),
  category: z.string().min(1),
  captain: z.preprocess((value) => JSON.parse(value as string), CaptainSchema),
  teammates: z.preprocess((value) => JSON.parse(value as string), TeammateSchema.array().min(1)),
  erinnerungspreis: zStringBoolean,
  faesslicup: zStringBoolean,
  termsAcceptance: z.preprocess((value) => JSON.parse(value as string), z.boolean().array().min(1)),
  votingOption: VotingOptionSchema,
});

export type Registration = z.infer<typeof RegistrationSchema>;
export type Teammate = z.infer<typeof TeammateSchema>;
export type VotingOption = z.infer<typeof VotingOptionSchema>;
