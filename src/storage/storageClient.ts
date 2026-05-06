import type { LogLimStorage } from "./LogLimStorage";

let storageClient: LogLimStorage | null = null;

export function configureStorageClient(client: LogLimStorage): void {
  storageClient = client;
}

export function getStorageClient(): LogLimStorage {
  if (!storageClient) {
    throw new Error("LogLim storage has not been configured.");
  }

  return storageClient;
}

