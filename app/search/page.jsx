'use client';
import { useState, useEffect, useCallback} from 'react';
import { useSearchParams } from 'next/navigation';
import MediaGrid from '@/components/MediaGrid';
import { fetchSearchResults } from '../api';

const searchResults = () => {
    const searchParams = useSearchParams();
    const search = searchParams.get('query');
    console.log(search);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if (!search) return; // Ensure there's a query to search for

        const fetchData = async () => {
            setLoading(true);
            try {
                let data;
                data = await fetchSearchResults(search);
                setItems(data.results);
            } catch (error) {
                console.error('Failed to fetch search media:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [search]);



  return (
    <section className="pt-20">
        {loading ? <p>Loading...</p> : <MediaGrid items={items} />}

    </section>
  );
};

export default searchResults;
