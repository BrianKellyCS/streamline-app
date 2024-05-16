'use client';
import React, { useState, useEffect, useCallback} from 'react';
import MediaGrid from '@/components/MediaGrid';
import MediaToggle from '@/components/MediaToggle';
import { fetchTopRatedMedia } from '../api';

const TopRated = () => {
  const [mediaType, setMediaType] = useState('movie');
  const [genre, setGenre] = useState(null);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  let data;


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        data = await fetchTopRatedMedia(mediaType, currentPage);

        setItems(currentPage === 1 ? data.results : [...items, ...data.results]);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error('Failed to fetch media:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mediaType, currentPage, genre]);

  // Handler to load more data
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  // Handler to change mediaType
  const handleMediaTypeChange = (type) => {
    if (type !== mediaType) {
      setMediaType(type);
      setItems([]); // Clear current items
      setGenre(null); // Reset genre when changing media type
      setCurrentPage(1); // Reset to first page
    }
  };

  const handleGenreSelect = (genreId, genreName) => {
    setGenre({ id: genreId, name: genreName });
    setItems([]);
    setCurrentPage(1);
  };


  const handleScroll = useCallback(() => {
    // Check if we're at the bottom of the page
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500 && !loading && currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  }, [loading, totalPages, currentPage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);


  return (
    <section className="pt-20">
      <h1 className="text-2xl font-bold mb-4 text-primary-orange">Top Rated</h1>
      <MediaToggle activeType={mediaType} onToggle={handleMediaTypeChange} />
      <MediaGrid items={items} mediaType={mediaType} />
      {currentPage < totalPages && (
        <div className="flex justify-center mt-4">
          <button onClick={handleLoadMore} className="bg-primary-orange hover:bg-orange-700 text-black font-bold py-2 px-4 rounded">
              Load More
          </button>
      </div>

      )}
    </section>
  );
};

export default TopRated;
