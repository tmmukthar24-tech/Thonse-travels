import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In serverless/read-only environments (e.g. AWS Lambda / Vercel), fall back to os.tmpdir()
let DATA_DIR = path.join(__dirname, "..", "data");

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch {
  DATA_DIR = path.join(os.tmpdir(), "thonse-data");
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn("[jsonStore] Using in-memory fallback for data storage:", err.message);
  }
}

const memoryStore = {};

/**
 * Read a JSON array file. Falls back gracefully in serverless/read-only environments.
 */
export function readJSONFile(filename, defaultValue = []) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      try {
        fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
      } catch {
        memoryStore[filename] = defaultValue;
      }
      return memoryStore[filename] || defaultValue;
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    return raw.trim() ? JSON.parse(raw) : defaultValue;
  } catch {
    return memoryStore[filename] || defaultValue;
  }
}

export function writeJSONFile(filename, data) {
  memoryStore[filename] = data;
  try {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.warn(`[jsonStore] Wrote to memory store for ${filename}:`, err.message);
  }
  return data;
}

/** Append a record to a JSON array file and persist it. */
export function appendJSONRecord(filename, record) {
  const items = readJSONFile(filename, []);
  items.push(record);
  writeJSONFile(filename, items);
  return record;
}
