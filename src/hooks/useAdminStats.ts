import { useCallback, useEffect, useState } from 'react';

import { IAdminStatistics } from '@/types/adminStats';

import { useLazyGetAdminStatsQuery } from '@/store/api/adminStatsApi';

const ADMIN_STATS_STORAGE_KEY = 'admin_stats';

export const useAdminStats = () => {
  const [stats, setStats] = useState<IAdminStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [trigger, { isLoading: isApiLoading }] = useLazyGetAdminStatsQuery();

  // Load stats from localStorage on mount
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const stored = localStorage.getItem(ADMIN_STATS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setStats(parsed);
        }
      } catch (err) {
        console.error('Failed to load admin stats from localStorage:', err);
      }
    };

    loadFromStorage();
  }, []);

  // Load stats from API
  const loadStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await trigger().unwrap();
      if (result?.data) {
        setStats(result.data);
        // Save to localStorage
        try {
          localStorage.setItem(ADMIN_STATS_STORAGE_KEY, JSON.stringify(result.data));
        } catch (err) {
          console.error('Failed to save admin stats to localStorage:', err);
        }
      }
    } catch (err) {
      setError(err);
      console.error('Failed to load admin stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [trigger]);

  // Load stats from API only if localStorage is empty
  useEffect(() => {
    if (!stats && !isLoading && !isApiLoading) {
      loadStats();
    }
  }, [stats, isLoading, isApiLoading, loadStats]);

  // Reload stats manually
  const reloadStats = useCallback(async () => {
    await loadStats();
  }, [loadStats]);

  return {
    stats,
    isLoading: isLoading || isApiLoading,
    error,
    reloadStats,
  };
};
