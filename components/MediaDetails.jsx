import React, { useEffect, useState, useRef } from 'react';
import { fetchMediaDetails } from '../app/api';
import { useRouter } from 'next/navigation';

const MediaDetails = ({ item, onClose }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const modalContentRef = useRef(null);
    const router = useRouter();
    

    const watchNow = (mediaType, id) => {
        onClose();
        router.push(`/watch-now?media=${mediaType}&id=${id}`);
    };

    useEffect(() => {
        if (!item) return;
        document.body.style.overflow = 'hidden';
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const detailsData = await fetchMediaDetails(item.media_type, item.id);
                setDetails(detailsData);
            } catch (error) {
                console.error('Error fetching media details:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [item]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const handleOverlayClick = (event) => {
        if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
            onClose();  // Close modal if the click is outside the modal content
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching details: {error.message}</p>;
    if (!details) return <p>No details found.</p>;

    const { title, name, credits, release_date, poster_path, overview, runtime, vote_average, backdrop_path } = details;
    const year = release_date ? `(${new Date(release_date).getFullYear()})` : '';
    const castList = credits?.cast.slice(0, 10);
    const backdropURL = `https://image.tmdb.org/t/p/original${backdrop_path}`;

    return (
        <div className="mt-10 fixed inset-0 flex justify-center items-center p-4" onClick={handleOverlayClick}
             style={{
                 backgroundImage: `url('${backdropURL}')`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
                 backgroundColor: 'rgba(0, 0, 0, 0.8)',
                 backgroundBlendMode: 'darken'
             }}>
            <div className="relative p-4 rounded-lg max-w-4xl w-full max-h-full overflow-auto" ref={modalContentRef}>
                <div className="flex flex-col sm:flex-row bg-black bg-opacity-80 rounded-lg">
                    <div className="relative flex-none w-full sm:w-auto">
                        <img src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt={title || name} style={{ width: '300px', height: 'auto' }} className="rounded-lg mx-auto"/>
                        <button className="absolute inset-0 m-auto w-12 h-12 text-white text-3xl font-bold flex items-center justify-center bg-primary-orange bg-opacity-75 rounded-full hover:bg-opacity-100 hover:w-16 hover:h-16 transition-all duration-300"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    watchNow(item.media_type, item.id);
                                }}>
                            <span style={{ transform: 'translateX(15%) translateY(-5%)'  }}>▶</span>
                        </button>
                    </div>
                    <div className="flex-grow p-4">
                        <h2 className="text-2xl text-primary-orange font-bold">{title || name} {year}</h2>
                        <p className="mt-4 text-gray-300 p-4">{overview}</p>
                        {item.media_type === 'movie' && (
                            <>
                                <p className="text-orange-500 p-2"><span className="mr-2">⭐ {Math.round(vote_average * 10) / 10}</span>Rating</p>
                                <p className="text-primary-orange p-2">Runtime: {runtime} mins</p>
                            </>
                        )}
                    </div>
                </div>
                <div className="mt-4">
    <h2 className="text-xl">Cast</h2>
    <div className="flex overflow-x-auto space-x-4 p-2">
        {castList.map(actor => (
            <div key={actor.cast_id} className="cast-card">
                <img src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`} alt={actor.name} className="rounded-full cast-image" />
                <div className="text-center">
                    <p className="cast-name">{actor.name}</p>
                    <p className="cast-character">{actor.character}</p>
                </div>
            </div>
        ))}
    </div>
</div>
                <button onClick={onClose} className="absolute top-3 right-3 text-lg font-bold text-white hover:bg-primary-orange">✕</button>
            </div>
        </div>
    );
};

export default MediaDetails;
