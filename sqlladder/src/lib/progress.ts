"use client";

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "sakila-progress-v1";

type ProgressMap = Record<string, Record<string, boolean>>;

function readAll(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProgressMap;
  } catch {
    return {};
  }
}

function writeAll(map: ProgressMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function useTopicProgress(topicId: string) {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const all = readAll();
    setDone(all[topicId] ?? {});
  }, [topicId]);

  const toggle = useCallback(
    (questionId: string) => {
      setDone((prev) => {
        const next = { ...prev, [questionId]: !prev[questionId] };
        const all = readAll();
        all[topicId] = next;
        writeAll(all);
        window.dispatchEvent(new CustomEvent("sakila:progress"));
        return next;
      });
    },
    [topicId]
  );

  return { done, toggle };
}

export function useAllProgress() {
  const [map, setMap] = useState<ProgressMap>({});

  useEffect(() => {
    const refresh = () => setMap(readAll());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("sakila:progress", refresh as EventListener);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("sakila:progress", refresh as EventListener);
    };
  }, []);

  return map;
}

export function countDone(map: ProgressMap, topicId: string): number {
  const t = map[topicId];
  if (!t) return 0;
  return Object.values(t).filter(Boolean).length;
}
