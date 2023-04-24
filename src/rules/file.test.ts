import { isFile, maxFileSize, minFileSize } from ".";
// Mocking a File object for testing
const createFile = (name: any, size: any) => {
  const file = new File([], name, { type: "text/plain" });
  Object.defineProperty(file, "size", { value: size });
  return file;
};
describe("isFile", () => {
  it("should return true for File objects", () => {
    const file = new File(["file content"], "file.txt", { type: "text/plain" });
    expect(isFile(file)).toBe(true);
  });

  it("should return true for Blob objects", () => {
    const blob = new Blob(["blob content"], { type: "text/plain" });
    expect(isFile(blob)).toBe(true);
  });

  it("should return false for non-File and non-Blob objects", () => {
    expect(isFile("file.txt")).toBe(false);
    expect(isFile({ name: "file.txt", type: "text/plain" })).toBe(false);
    expect(isFile(null)).toBe(false);
    expect(isFile(undefined)).toBe(false);
    expect(isFile(123)).toBe(false);
    expect(isFile(true)).toBe(false);
    expect(isFile([])).toBe(false);
    expect(isFile({})).toBe(false);
    expect(isFile(() => {})).toBe(false);
  });
});

describe("maxFileSize", () => {
  test("should return true if file size is within the specified limit", () => {
    const file1KB = createFile("file1KB.txt", 1024); // 1KB
    const file5MB = createFile("file5MB.txt", 5 * 1024 * 1024); // 5MB
    const file10GB = createFile("file10GB.txt", 10 * 1024 * 1024 * 1024); // 10GB

    expect(maxFileSize(file1KB, "2KB")).toBe(true);
    expect(maxFileSize(file5MB, "10MB")).toBe(true);
    expect(maxFileSize(file10GB, "20GB")).toBe(true);
    expect(maxFileSize(file10GB, "10GB")).toBe(true);
    expect(maxFileSize(file10GB, "10240MB")).toBe(true);
    expect(maxFileSize(file10GB, "10485760KB")).toBe(true);
    expect(maxFileSize(file10GB, "10737418240B")).toBe(true);
  });

  test("should throw an error for non-file inputs", () => {
    expect(maxFileSize("not a file", "2KB")).toBe(false);
  });

  test("should throw an error for invalid maxSize format", () => {
    const file1KB = createFile("file1KB.txt", 1024); // 1KB

    expect(() => maxFileSize(file1KB, "2KB123")).toThrow(
      "Invalid maxSize format. Please use valid format like '1KB', '1MB', etc."
    );

    expect(() => maxFileSize(file1KB, "B")).toThrow(
      "Invalid maxSize format. Please use valid format like '1KB', '1MB', etc."
    );
    expect(() => maxFileSize(file1KB, "10TB")).toThrow(
      "Invalid maxSize format. Please use valid format like '1KB', '1MB', etc."
    );
  });
});

describe("minFileSize", () => {
  const file = createFile("text.txt", 1024); // Create a sample File object for testing

  it("should return true for file with size greater than or equal to minSize", () => {
    const result1 = minFileSize(file, "1KB");
    expect(result1).toBe(true);
  });

  it("should return false for file with size smaller than minSize", () => {
    const result2 = minFileSize(file, "1MB");
    expect(result2).toBe(false);
  });

  it("should throw error for invalid minSize format", () => {
    // Test with an invalid minSize format
    expect(() => minFileSize(file, "1ABC")).toThrowError();
  });

  it("should return false for non-file input", () => {
    // Test with a non-file input
    expect(minFileSize("test", "1KB")).toBe(false);
  });
});
