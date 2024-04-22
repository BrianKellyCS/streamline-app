'use client';
import { useState, useEffect, useCallback} from 'react';
import { usePathname } from 'next/navigation';
import MediaGrid from '@/components/MediaGrid';
import { fetchGenreMedia } from '../../api';

const genrePage = () => {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);
    const mediaType = segments[0];
    const id = segments[1];
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchGenreMedia(mediaType, id, currentPage);
                const enhancedItems = data.results.map(item => ({
                    ...item,
                    media_type: mediaType // Add mediaType to each item
                }));
                setItems(currentPage === 1 ? enhancedItems : [...items, ...enhancedItems]);
                setTotalPages(data.total_pages);
            } catch (error) {
                console.error('Failed to fetch genre media:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentPage, mediaType, id]); // Add dependencies to useEffect

      // Handler to load more data
    const handleLoadMore = () => {
        if (currentPage < totalPages) {
        setCurrentPage(prevPage => prevPage + 1);
        }
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
        <MediaGrid items={items} />
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

export default genrePage;
