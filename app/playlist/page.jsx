'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import MediaGrid from '@/components/MediaGrid';
import { fetchWatchHistoryDetails } from '../api';

const Playlist = () => {
  const { user } = useAuth();
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetch(`/api/get-playlist?username=${user.username}`)
        .then((res) => res.json())
        .then(async (data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          // Assuming fetchPlaylistDetails is a function to fetch detailed info for items
          const details = await fetchWatchHistoryDetails(data);
          setPlaylist(details);
        })
        .catch(err => {
          setError(err.message);
          console.error('Error fetching playlist:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="pt-20">
      <h1 className="text-2xl font-bold mb-4 text-primary-orange">Playlist</h1>
      <MediaGrid items={playlist} />
    </section>
  );
};

export default Playlist;