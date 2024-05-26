import {
  fileBetween,
  isFile,
  isMimes,
  maxFileSize,
  minFileSize,
} from '../../src/rules';
// Mocking a File object for testing
const createFile = (name: any, size: any) => {
  const file = new File([], name, { type: 'text/plain' });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};
describe('isFile', () => {
  it('should return true for File objects', () => {
    const file = new File(['file content'], 'file.txt', { type: 'text/plain' });
    expect(isFile(file).passes).toBe(true);
  });

  it('should return true for Blob objects', () => {
    const blob = new Blob(['blob content'], { type: 'text/plain' });
    expect(isFile(blob).passes).toBe(true);
  });

  it('should return false for non-File and non-Blob objects', () => {
    expect(isFile('file.txt').passes).toBe(false);
    expect(isFile({ name: 'file.txt', type: 'text/plain' }).passes).toBe(false);
    expect(isFile(null).passes).toBe(false);
    expect(isFile(undefined).passes).toBe(false);
    expect(isFile(123).passes).toBe(false);
    expect(isFile(true).passes).toBe(false);
    expect(isFile([]).passes).toBe(false);
    expect(isFile({}).passes).toBe(false);
    expect(isFile(() => {}).passes).toBe(false);
  });
});

describe('maxFileSize', () => {
  test('should return true if file size is within the specified limit', () => {
    const file1KB = createFile('file1KB.txt', 1024); // 1KB
    const file5MB = createFile('file5MB.txt', 5 * 1024 * 1024); // 5MB
    const file10GB = createFile('file10GB.txt', 10 * 1024 * 1024 * 1024); // 10GB

    expect(maxFileSize(file1KB, '2KB').passes).toBe(true);
    expect(maxFileSize(file5MB, '10MB').passes).toBe(true);
    expect(maxFileSize(file10GB, '20GB').passes).toBe(true);
    expect(maxFileSize(file10GB, '10GB').passes).toBe(true);
    expect(maxFileSize(file10GB, '10240MB').passes).toBe(true);
    expect(maxFileSize(file10GB, '10485760KB').passes).toBe(true);
    expect(maxFileSize(file10GB, '10737418240B').passes).toBe(true);
  });

  test('should throw an error for non-file inputs', () => {
    expect(maxFileSize('not a file', '2KB').passes).toBe(false);
  });

  test('should throw an error for invalid size format', () => {
    const file1KB = createFile('file1KB.txt', 1024); // 1KB

    expect(() => maxFileSize(file1KB, '2KB123')).toThrow(
      "Invalid size format. Please use valid format like '1KB', '1MB', etc.",
    );

    expect(() => maxFileSize(file1KB, 'B')).toThrow(
      "Invalid size format. Please use valid format like '1KB', '1MB', etc.",
    );
    expect(() => maxFileSize(file1KB, '10TB')).toThrow(
      "Invalid size format. Please use valid format like '1KB', '1MB', etc.",
    );
  });
});

describe('minFileSize', () => {
  const file = createFile('text.txt', 1024); // Create a sample File object for testing

  it('should return true for file with size greater than or equal to minSize', () => {
    const result1 = minFileSize(file, '1KB').passes;
    expect(result1).toBe(true);
  });

  it('should return false for file with size smaller than minSize', () => {
    const result2 = minFileSize(file, '1MB').passes;
    expect(result2).toBe(false);
  });

  it('should throw error for invalid minSize format', () => {
    // Test with an invalid minSize format
    expect(() => minFileSize(file, '1ABC')).toThrowError();
  });

  it('should return false for non-file input', () => {
    // Test with a non-file input
    expect(minFileSize('test', '1KB').passes).toBe(false);
  });
});

describe('fileBetween', () => {
  const file = createFile('text.txt', 1024); // Create a sample File object for testing

  it('should return true for file with size between min and max', () => {
    const result1 = fileBetween(file, '1KB, 2KB').passes;
    expect(result1).toBe(true);
  });

  it('should return false for file with size not between in min and max', () => {
    const result2 = fileBetween(file, '1MB, 2MB').passes;
    expect(result2).toBe(false);
  });
});

describe('isMimes', () => {
  it('should return true for files with matching MIME types', () => {
    const file1 = new File([], 'file.txt', { type: 'text/plain' });
    const file2 = new File([], 'file2.pdf', { type: 'application/pdf' });

    expect(isMimes(file1, '*.txt').passes).toBe(true);
    expect(isMimes(file1, 'text/plain').passes).toBe(true);
    expect(isMimes(file2, '*.pdf').passes).toBe(true);
    expect(isMimes(file2, 'application/pdf').passes).toBe(true);
  });

  it('should return false for files with non-matching MIME types', () => {
    const file1 = new File([], 'file2.pdf', { type: 'application/pdf' }); // 1KB
    const file2 = createFile('file2.pdf', 2048); // 2KB
    expect(isMimes(file1, 'image/jpeg').passes).toBe(false);
    expect(isMimes(file2, '*.txt').passes).toBe(false);
    expect(isMimes(file2, 'image/png').passes).toBe(false);
  });

  it('should handle wildcard (*) MIME type', () => {
    const file1 = createFile('file1.txt', 1024); // 1KB
    const file2 = createFile('file2.pdf', 2048); // 2KB
    expect(isMimes(file1, '*').passes).toBe(true);
    expect(isMimes(file2, '*').passes).toBe(true);
  });

  it('should handle MIME type groups', () => {
    const file1 = createFile('file1.txt', 1024); // 1KB

    const file2 = new File([], 'file2.jpg', { type: 'image/jpg' }); // 2KB

    expect(isMimes(file1, 'text/*').passes).toBe(true);
    expect(isMimes(file2, 'image/*').passes).toBe(true);
  });

  it('should handle multiple MIME types', () => {
    const file1 = createFile('file1.txt', 1024);

    const file2 = new File([], 'file2.pdf', { type: 'application/pdf' });

    expect(isMimes(file1, '*.txt, text/plain').passes).toBe(true);
    expect(isMimes(file2, '*.pdf, image/jpeg').passes).toBe(true);
  });

  it('should return false for non-File inputs', () => {
    expect(isMimes('not a file', '*.txt').passes).toBe(false);
    expect(isMimes(null, '*.pdf').passes).toBe(false);
    expect(isMimes(undefined, 'image/jpeg').passes).toBe(false);
    expect(isMimes(123, 'text/plain').passes).toBe(false);
    expect(isMimes(true, 'application/pdf').passes).toBe(false);
    expect(isMimes([], '*.txt').passes).toBe(false);
  });

  it('should throw an error for empty param', () => {
    const file = createFile('file.txt', 1024); // 1KB

    expect(() => isMimes(file, '')).toThrowError();
  });
});
