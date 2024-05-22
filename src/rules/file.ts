import { InputValueType, RuleCallBack } from '../contracts';
import {
  convertFileSize,
  explodeFileParam,
  fileToArray,
  spliteParam,
  throwEmptyArgsException,
} from '../utils';

/**
 * Checks whether a given value is a `File` or `Blob` object.
 *
 * @param value - The value to check.
 * @example
 *  ```html
 * <input data-tr-rules="file" />
 * ```
 */
export const isFile: RuleCallBack = (value) => {
  const _isFile = (f: unknown) => {
    return f instanceof File || f instanceof Blob || f instanceof FileList;
  };
  let passes = false;
  if (
    Array.isArray(value) &&
    !!value.length &&
    value.every((f) => _isFile(f))
  ) {
    passes = true;
  }
  passes = _isFile(value) || passes;

  return {
    passes: passes,
    value: value,
  };
};

/**
 * Checks whether the size of a given `File` or `Blob` object is less than or equal to a given maximum size.
 *
 * @param input - The `File` or `Blob` object to check.
 * @param maxSize - The maximum size in bytes, specified as a string with an optional unit of measurement (B, KB, MB, or GB).
 * @example
 *  ```html
 * <input data-tr-rules="maxFileSize:1MB" />
 * ```
 * @throws If the `maxSize` parameter is not in a valid format, an error is thrown.
 */
export const maxFileSize: RuleCallBack = (input, maxSize) => {
  const files = fileToArray(input);

  if (!files.length) {
    return {
      value: input,
      passes: false,
    };
  }
  const passes = files.every((input) => {
    if (isFile(input).passes) {
      let numericValue, unit;
      // eslint-disable-next-line no-useless-catch
      try {
        [numericValue, unit] = explodeFileParam(maxSize as string);
      } catch (error) {
        throw error;
      }
      return (
        input.size <= convertFileSize(numericValue as number, unit as string)
      );
    } else {
      return true;
    }
  });

  return {
    passes: passes,
    value: files,
  };
};
/**
 * A validation rule that checks if the size of a file is greater than or equal to the specified minimum size.
 *
 * @param input The input value to validate. Should be a File or Blob object.
 * @param minSize The minimum size of the file. Should be a string in the format '<number><unit>', where 'unit' can be one of 'B', 'KB', 'MB', 'GB'. For example, '1KB' represents 1 kilobyte, '2MB' represents 2 megabytes, etc.
 * @example
 *  ```html
 * <input data-tr-rules="minFileSize:1MB" />
 * ```
 *
 * @throws An error if the minSize parameter is not a valid string in the format '<number><unit>'.
 */
export const minFileSize: RuleCallBack = (input, minSize) => {
  const files = fileToArray(input);
  if (!files.length) {
    return {
      value: input,
      passes: false,
    };
  }
  if (typeof minSize !== 'number' && typeof minSize !== 'string') {
    throwEmptyArgsException(
      'minFileSize',
      'The minimum size rule argument is required',
    );
  }
  const passses = files.every((input) => {
    if (isFile(input).passes) {
      let numericValue, unit;
      // eslint-disable-next-line no-useless-catch
      try {
        [numericValue, unit] = explodeFileParam(minSize as string);
      } catch (error) {
        throw error;
      }
      return (
        input.size >= convertFileSize(numericValue as number, unit as string)
      );
    } else {
      return false;
    }
  });
  return {
    passes: passses,
    value: files,
  };
};

/**
 * Checks whether the size of a given `File` or `Blob` object is between the specified minimum and maximum size.
 *
 * @param input - The `File` or `Blob` object to check.
 * @param min_max - The string containing the minimum and maximum size values, separated by a delimiter.
 * @example
 * ```html
 * <input data-tr-rules="fileBetween:1MB,5MB" />
 * ```
 */
export const fileBetween: RuleCallBack = (input, min_max) => {
  if (typeof min_max !== 'string') {
    throwEmptyArgsException('between');
  }
  const [min, max] = spliteParam(min_max as string);
  const files = fileToArray(input);
  if (!files.length) {
    return {
      value: input,
      passes: false,
    };
  }
  const passes = files.every((input) => {
    return maxFileSize(input, max).passes && minFileSize(input, min).passes;
  });
  return {
    passes: passes,
    value: input,
  };
};

/**
 * Checks whether the MIME type of a given `File` or `Blob` object matches the specified MIME type.
 *
 * @param input - The `File` or `Blob`, `FileList` File[] object to check.
 * @param param - The MIME type(s) to match. It can be a wildcard (*), a specific MIME type (.pdf), or a MIME type group (images/*).
 *
 * @example
 * ```html
 * <input type="file" data-tr-rules="mimes:.pdf"
 * ```
 */
export const isMimes: RuleCallBack = (input, param) => {
  if (typeof param !== 'string') {
    throwEmptyArgsException('mimes');
  }
  if (param === '') {
    throwEmptyArgsException('mimes');
  }

  const files = fileToArray(input);
  if (!files.length) {
    return {
      value: input,
      passes: false,
    };
  }

  const passes = files.every((input) => {
    if (isFile(input).passes) {
      const file = input as File;

      const allowedMimes =
        (param as string).split(',').map((m: string) => m.trim()) ?? [];

      const passes = allowedMimes.some((allowedMime) => {
        allowedMime = allowedMime.replace(/\s/g, '');
        if (
          allowedMime === '*' ||
          file.name.endsWith(allowedMime) ||
          allowedMime == '' ||
          file.type == ''
        ) {
          return true; // Wildcard (*) matches any MIME type
        } else if (allowedMime.endsWith('/*')) {
          const group = allowedMime.slice(0, -2); // Remove the trailing /*
          return file.type.startsWith(group);
        } else if (allowedMime.startsWith('*.')) {
          const ext = allowedMime.substring(2); // get extension without the "*."
          return file.name.endsWith(ext);
        } else {
          return file.type === allowedMime;
        }
      });
      return passes;
    } else {
      return false;
    }
  });
  return {
    passes: passes,
    value: input,
  };
};
