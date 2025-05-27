export function splitArrayByKey<T>(arr: T[], key: keyof T) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]![key] !== arr[0]![key]) {
      return [arr.slice(0, i), arr.slice(i)];
    }
  }
  return [arr, []]; // If the key doesn't change, return the original array and an empty array
}

/**
 * Groups an array of objects by a specified key property.
 * @param arr - The array of objects to be grouped.
 * @param keyProperty - The key property to group the objects by.
 * @param substringSeparator - Optional separator to split the key property value and use only the first part.
 * @returns An object where the keys are the grouped values and the values are arrays of objects with matching key values.
 */
export const groupBy = <T extends Record<string, unknown>, K extends keyof T>(
  arr: readonly T[],
  keyProperty: K,
  substringSeparator?: string
) =>
  arr.reduce(
    (output, item) => {
      const key = (substringSeparator ? String(item[keyProperty]).split(substringSeparator)[0] : String(item[keyProperty])) ?? '';
      output[key] ||= [];
      output[key].push(item);
      return output;
    },
    {} as Record<string, T[]>
  );

export const shuffle = <T>(array: T[]): T[] => {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex] as unknown, array[randomIndex] as unknown] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};
