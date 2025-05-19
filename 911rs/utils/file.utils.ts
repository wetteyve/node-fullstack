type ImageFormatItem = {
  height: number;
  width: number;
  url: string;
};

export type ImageFormats = {
  large?: ImageFormatItem;
  medium?: ImageFormatItem;
  small?: ImageFormatItem;
  thumbnail: ImageFormatItem;
};

export type ImageFormatKey = keyof ImageFormats;

export const imageSizeOrder: ImageFormatKey[] = ['large', 'medium', 'small', 'thumbnail'];

type Image = {
  height: number;
  width: number;
  alternativeText?: string;
  caption?: string;
  formats?: ImageFormats;
};

export type File<T = Image> = {
  id: string;
  url: string;
} & T;
