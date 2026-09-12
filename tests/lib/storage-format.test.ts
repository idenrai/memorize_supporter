import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatStorageMB } from "../../src/lib/storage-format.ts";

describe("formatStorageMB", () => {
  it("formats 0 or negative values as 0 MB", () => {
    assert.strictEqual(formatStorageMB(0), "0 MB");
    assert.strictEqual(formatStorageMB(-1), "0 MB");
  });

  it("formats values less than 0.1 MB", () => {
    assert.strictEqual(formatStorageMB(0.05), "< 0.1 MB");
  });

  it("formats standard megabyte values cleanly", () => {
    assert.strictEqual(formatStorageMB(2.15), "2.2 MB");
    assert.strictEqual(formatStorageMB(10), "10 MB");
    assert.strictEqual(formatStorageMB(500.4), "500.4 MB");
  });

  it("formats gigabyte values above 1000 MB", () => {
    assert.strictEqual(formatStorageMB(1024), "1 GB");
    assert.strictEqual(formatStorageMB(120000), "117.2 GB");
  });
});
