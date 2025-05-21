import { type ImageFormatKey, type ImageFormats, imageSizeOrder, type File } from '#rs911/utils/file.utils';
import placeholderUrl from '/images/image-placeholder.svg?url';
import { useScreenStore } from '../../../store/screen.store';

const placeholderImage = {
  id: 'placeholder',
  alternativeText: 'image file error placeholder',
  caption: 'placeholder',
  url: placeholderUrl,
  height: 245,
  width: 245,
};

/**
 * Retrieves the image file based on the provided image object and format.
 * If no image file is provided, a placeholder image is returned.
 *
 * @param image - The image object containing the file attributes.
 * @param format - The desired format of the image file (optional, defaults to the defaultImgFormat from useScreenStore()).
 * @returns The image file with additional properties (id and url).
 */
export const getImage = (rawImage: any, format: ImageFormatKey = useScreenStore.use.defaultImgFormat()): File => {
  const image = rawImage?.data ? rawImage : { data: rawImage };

  // if no image-file is provided, return placeholder image
  if (!image || !image.data.attributes.mime.startsWith('image')) {
    return placeholderImage;
  }

  const url = getFormatUrl(format, image.data.attributes.formats) || image.data.attributes.url;
  const { hash: id } = image.data.attributes;

  return { ...image.data.attributes, id, url } as File;
};

/**
 * Get the URL of the requested image format from the available formats.
 * @param requestedSize - The requested size of the image format.
 * @param formats - The available image formats.
 * @returns The URL of the requested image format, or undefined if no formats are available.
 */
const getFormatUrl = (requestedSize: ImageFormatKey, formats: unknown) => {
  // if no formats are available, return undefined
  if (!formats) return undefined;

  const typedFormats = formats as ImageFormats;

  // if requested format is available, return it
  if (typedFormats[requestedSize]) return typedFormats[requestedSize]?.url;

  // if requested format is not available, return next best format
  const startIndex = imageSizeOrder.indexOf(requestedSize);
  for (let i = startIndex; i < imageSizeOrder.length; i++) {
    const size = imageSizeOrder[i];
    if (typedFormats[size!]) {
      return typedFormats[size!]?.url;
    }
  }
};
