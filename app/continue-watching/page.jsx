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

  useEffect(() => {
    if (user) {
      fetch(`/api/get-watch-history?username=${user.username}`)
        .then((res) => res.json())
        .then(async (data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          console.log("fsdlkfjdsklfj", data);
          const details = await fetchWatchHistoryDetails(data);
          setWatchHistory(details);
        })
        .catch(err => {
          setError(err.message);
          console.error('Error fetching watch history:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="pt-20">
      <h1 className="text-2xl font-bold mb-4 text-primary-orange">Continue Watching</h1>
      <MediaGrid items={watchHistory} />
    </section>
  );
};

export default ContinueWatching;
