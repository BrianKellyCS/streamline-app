// pages/continue-watching.js
'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import MediaGrid from '@/components/MediaGrid';
import { fetchWatchHistoryDetails } from '../api';

const ContinueWatching = () => {
  const { user } = useAuth();
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    if (!user) {
      setWatchHistory([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/get-watch-history?username=${user.username}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const details = await fetchWatchHistoryDetails(data);
      setWatchHistory(details);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching watch history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleRemoveFromHistory = async (item) => {
    if (!user) return;

    const itemKey = `${item.mediaType || item.mediatype || 'movie'}-${item.id}`;
    const previousItems = watchHistory;

    setWatchHistory((currentItems) =>
      currentItems.filter((entry) => `${entry.mediaType || entry.mediatype || 'movie'}-${entry.id}` !== itemKey)
    );

    try {
      const response = await fetch('/api/delete-watch-history', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          mediaType: item.mediaType || item.mediatype,
          mediaID: item.id,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to remove item from watch history.');
      }
    } catch (err) {
      setWatchHistory(previousItems);
      setError(err.message);
      console.error('Error removing watch history item:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="pt-20">
      <h1 className="text-2xl font-bold mb-4 text-primary-orange">Watch History</h1>
      <MediaGrid items={watchHistory} onRemoveItem={handleRemoveFromHistory} />
    </section>
  );
};

export default ContinueWatching;
