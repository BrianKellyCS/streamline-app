'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MediaGrid from '@/components/MediaGrid';
import { fetchSearchResults } from '../api';

function SearchFallback() {
    return <div>Loading search results...</div>;
}

const SearchResults = () => {
    return (
        <Suspense fallback={<SearchFallback />}>
            <SearchContent />
        </Suspense>
    );
};

const SearchContent = () => {
    const searchParams = useSearchParams();
    const search = searchParams.get('query');
    console.log(search);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!search) return; // Ensure there's a query to search for

        const fetchData = async () => {
            try {
                const data = await fetchSearchResults(search);
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

export default SearchResults;
