import { useState, useCallback, useEffect } from "react";
import { database, ensureFirebase, dbRef, dbGet, dbSet, dbUpdate, dbRemove } from "../firebase/config";
import { useAuth } from "./useAuth";

// ============================================================================
// Types
// ============================================================================

type LoadingState = "idle" | "loading" | "success" | "error";

interface UseRecordResult<T> {
  data: T | null;
  loadingState: LoadingState;
  error: string | null;
  refetch: () => Promise<void>;
  set: (data: Record<string, unknown>) => Promise<void>;
  update: (data: Record<string, unknown>) => Promise<void>;
  remove: () => Promise<void>;
}

interface UseListResult<T> {
  data: T[];
  loadingState: LoadingState;
  error: string | null;
  refetch: () => Promise<void>;
}

// ============================================================================
// Hook: useRecord
// Fetches and manages a single Realtime Database node.
// ============================================================================

/**
 * Hook for reading and writing a single Realtime Database node.
 * Path supports {userId} placeholder that auto-resolves to the authenticated user's UID.
 *
 * @param path Database path, e.g. "users/{userId}" or "users/{userId}/settings"
 *
 * @example
 * ```tsx
 * const { data: user, loadingState, update } = useRecord("users/{userId}");
 * ```
 */
export function useRecord<T>(path: string): UseRecordResult<T> {
  const { firebaseUser } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);

  // Resolve path: replace {userId} with actual UID
  const resolvedPath = path.replace("{userId}", firebaseUser?.uid || "");

  const fetchRecord = useCallback(async () => {
    if (!resolvedPath) {
      setData(null);
      setLoadingState("idle");
      return;
    }

    ensureFirebase();
    setLoadingState("loading");
    setError(null);

    try {
      const snapshot = await dbGet(dbRef(database, resolvedPath));
      if (snapshot.exists()) {
        setData(snapshot.val() as T);
      } else {
        setData(null);
      }
      setLoadingState("success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch data.";
      setError(message);
      setLoadingState("error");
      console.error(`Error fetching ${resolvedPath}:`, err);
    }
  }, [resolvedPath]);

  const setRecord = useCallback(
    async (newData: Record<string, unknown>): Promise<void> => {
      ensureFirebase();

      try {
        await dbSet(dbRef(database, resolvedPath), newData);
        await fetchRecord();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to set data.";
        setError(message);
        throw err;
      }
    },
    [resolvedPath, fetchRecord]
  );

  const updateRecord = useCallback(
    async (newData: Record<string, unknown>): Promise<void> => {
      ensureFirebase();

      try {
        await dbUpdate(dbRef(database, resolvedPath), newData);
        await fetchRecord();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update data.";
        setError(message);
        throw err;
      }
    },
    [resolvedPath, fetchRecord]
  );

  const removeRecord = useCallback(async (): Promise<void> => {
    ensureFirebase();

    try {
      await dbRemove(dbRef(database, resolvedPath));
      setData(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete data.";
      setError(message);
      throw err;
    }
  }, [resolvedPath]);

  // Fetch on mount and when path changes
  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);

  return {
    data,
    loadingState,
    error,
    refetch: fetchRecord,
    set: setRecord,
    update: updateRecord,
    remove: removeRecord,
  };
}

// ============================================================================
// Hook: useList
// Fetches a list from a Realtime Database node.
// ============================================================================

/**
 * Hook for reading a list of items from a Realtime Database node.
 * The node must store data as an object with auto-generated keys.
 * Returns the data as an array with `id` fields.
 *
 * @param path Database path, e.g. "users/{userId}/projects"
 *
 * @example
 * ```tsx
 * const { data: projects, loadingState } = useList("users/{userId}/projects");
 * ```
 */
export function useList<T>(path: string): UseListResult<T> {
  const { firebaseUser } = useAuth();
  const [data, setData] = useState<T[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);

  const resolvedPath = path.replace("{userId}", firebaseUser?.uid || "");

  const fetchList = useCallback(async () => {
    if (!resolvedPath) {
      setData([]);
      setLoadingState("idle");
      return;
    }

    ensureFirebase();
    setLoadingState("loading");
    setError(null);

    try {
      const snapshot = await dbGet(dbRef(database, resolvedPath));
      if (snapshot.exists()) {
        const val = snapshot.val() as Record<string, unknown>;
        const items = Object.keys(val).map((key) => ({
          id: key,
          ...(val[key] as Record<string, unknown>),
        })) as T[];
        setData(items);
      } else {
        setData([]);
      }
      setLoadingState("success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch list.";
      setError(message);
      setLoadingState("error");
      console.error(`Error fetching list ${resolvedPath}:`, err);
    }
  }, [resolvedPath]);

  // Fetch on mount and when path changes
  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return {
    data,
    loadingState,
    error,
    refetch: fetchList,
  };
}

// ============================================================================
// Legacy hook alias
// ============================================================================

/**
 * Provides direct Realtime Database access.
 */
export function useDatabase() {
  return { database, ensureFirebase };
}