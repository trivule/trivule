import { RuleCallBack } from "../contracts";

export const isFile: RuleCallBack = (value) => {
  return value instanceof File || value instanceof Blob;
};

export const maxFileSize: RuleCallBack = (input, maxSize) => {
  if (isFile(input)) {
    const file = input as File;
    const sizeInBytes = file.size;
    let maxSizeInBytes: number;

    // Check if maxSize has a valid unit and extract the numeric value and unit
    const match = maxSize?.match(/^(\d+(\.\d+)?)\s*(B|KB|MB|GB)$/i);
    if (!match) {
      throw new Error(
        "Invalid maxSize format. Please use valid format like '1KB', '1MB', etc."
      );
    }

    const numericValue = parseFloat(match[1]);
    const unit = match[3].toUpperCase();

    // Convert maxSize to bytes based on unit
    if (unit === "KB") {
      maxSizeInBytes = numericValue * 1024;
    } else if (unit === "MB") {
      maxSizeInBytes = numericValue * 1024 * 1024;
    } else if (unit === "GB") {
      maxSizeInBytes = numericValue * 1024 * 1024 * 1024;
    } else {
      maxSizeInBytes = numericValue; // If no unit specified, consider it as bytes
    }
    return sizeInBytes <= maxSizeInBytes;
  } else {
    return false;
  }
};

export const minFileSize: RuleCallBack = (input, minSize) => {
  if (isFile(input)) {
    const file = input as File;
    const sizeInBytes = file.size;
    let minSizeInBytes: number;

    const match = minSize?.match(/^(\d+(\.\d+)?)\s*(B|KB|MB|GB)$/i);
    if (!match) {
      throw new Error(
        "Invalid minSize format. Please use valid format like '1KB', '1MB', etc."
      );
    }

    const numericValue = parseFloat(match[1]);
    const unit = match[3].toUpperCase();

    // Convert minSize to bytes based on unit
    if (unit === "KB") {
      minSizeInBytes = numericValue * 1024;
    } else if (unit === "MB") {
      minSizeInBytes = numericValue * 1024 * 1024;
    } else if (unit === "GB") {
      minSizeInBytes = numericValue * 1024 * 1024 * 1024;
    } else {
      minSizeInBytes = numericValue; // If no unit specified, consider it as bytes
    }
    return sizeInBytes >= minSizeInBytes;
  } else {
    return false;
  }
};
