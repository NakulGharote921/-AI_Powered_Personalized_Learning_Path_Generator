/**
 * @deprecated This file is kept for backward compatibility.
 * Use 'useRealtimeDB' instead for Realtime Database operations.
 *
 * This file re-exports from the new Realtime Database hooks.
 */
import { useRecord, useList, useDatabase } from "./useRealtimeDB";

export { useRecord, useList, useDatabase };

/**
 * @deprecated Renamed to useRecord / useList / useDatabase.
 * Will be removed in a future version.
 */
export function useDocument(path: string, docId: string) {
  return useRecord(`${path}/${docId}`);
}

export function useCollection(path: string) {
  return useList(path);
}

export function useFirestore() {
  return useDatabase();
}