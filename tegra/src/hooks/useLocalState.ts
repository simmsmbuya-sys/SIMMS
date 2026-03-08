import { useState, useCallback } from "react";

export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  return { isOpen, open, close, toggle };
}

export function useFilter<T>(items: T[], filterFn: (item: T, query: string) => boolean) {
  const [query, setQuery] = useState("");
  const filtered = query ? items.filter((item) => filterFn(item, query.toLowerCase())) : items;
  return { query, setQuery, filtered };
}

export function useTabs(defaultTab: string) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return { activeTab, setActiveTab };
}
