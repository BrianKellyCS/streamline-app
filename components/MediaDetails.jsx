import React, { useEffect, useState, useRef } from 'react';
import { fetchMediaDetails } from '../app/api';
import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';

const MediaDetails = ({ item, onClose, mediaType }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const modalContentRef = useRef(null);
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [doNotShowAgain, setDoNotShowAgain] = useState(false);

    if(mediaType == 'none'){
        mediaType = item.media_type;
    }

    const handleDoNotShowAgainChange = () => {
        setDoNotShowAgain(!doNotShowAgain);
    };
    
const handleWatchNow = (mediaType, id) => {
    const showModalCookie = Cookie.get('showModal');
    if (showModalCookie !== 'false') {
        setShowModal(true);
    }
        else{
            watchNow(mediaType, id);
        }

};

    // Use this function to navigate after modal confirmation
    const confirmWatchNow = (mediaType, id) => {
        if (doNotShowAgain) {
            Cookie.set('showModal', 'false', { expires: 365, path: '/' });
            console.log('Cookie set to not show modal again.');
        }
        setShowModal(false);
        console.log('Modal closed via confirmWatchNow.');
        onClose();
        router.push(`/watch-now?media=${mediaType}&id=${id}`);
    };
    

    const getBrowser = () => {
        // Simple browser detection
        if (/Chrome/.test(navigator.userAgent)) {
            return 'chrome';
        } else if (/Firefox/.test(navigator.userAgent)) {
            return 'firefox';
        } else {
            return 'other';
        }
    };

    const adBlockerModal = () => {
        const browser = getBrowser();
        const chromeLink = 'https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm';
        const firefoxLink = 'https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/';
    
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4">
                <div className="bg-black text-white p-6 rounded-lg border border-gray-700">
                    <p className="mb-4 text-bold">Please note before continuing:</p>
                    <p className="mb-4">The video player contains popup ads. For an optimal viewing experience, we recommend using an ad blocker.</p>
                    {browser === 'chrome' && (
                        <a href={chromeLink} className="text-primary-orange hover:text-orange-600 mb-4 block" target="_blank" rel="noopener noreferrer">Install uBlock Origin for Chrome</a>
                    )}
                    {browser === 'firefox' && (
                        <a href={firefoxLink} className="text-primary-orange hover:text-orange-600 mb-4 block" target="_blank" rel="noopener noreferrer">Install uBlock Origin for Firefox</a>
                    )}
                    <div className="flex items-center mb-4">
                        <input type="checkbox" checked={doNotShowAgain} onChange={handleDoNotShowAgainChange} />
                        <span className="ml-2">Do not show this again</span>
                    </div>
                    <div className="flex justify-evenly mt-4">
                        <button className="bg-primary-orange text-black hover:bg-orange-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => confirmWatchNow(mediaType, item.id)}>
                            Continue to Watch
                        </button>
                        <button className="bg-gray-800 text-white hover:bg-gray-600 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    };
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
                const detailsData = await fetchMediaDetails(mediaType, item.id);
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

    const renderStreamingProviders = (streamingData) => {
        const providers = streamingData?.results?.US?.flatrate || [];  // Adjust country code as needed
        return providers.length > 0 ? (
            <div>
                <h3 className="text-xl text-primary-orange">Streaming on:</h3>
                <div className="flex flex-wrap">
                    {providers.map(provider => (
                        <div key={provider.provider_id} className="p-2">
                            <img src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} alt={provider.provider_name} className="w-20 h-full object-cover rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        ) : <p className="text-primary-orange"></p>; {/*in case i want to display an alternative msg */}
    };

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
                                    handleWatchNow(mediaType, item.id);
                                }}>
                            <span style={{ transform: 'translateX(15%) translateY(-5%)'  }}>▶</span>
                        </button>
                    </div>
                    <div className="flex-grow p-4">
                        <h2 className="text-2xl text-primary-orange font-bold">{title || name} {year}</h2>
                        {mediaType === 'movie' && (
                            <>
                                <p className="text-primary-orange p-2">{runtime} mins</p>
                                <p className="text-orange-500 p-2"><span className="mr-2">⭐ {Math.round(vote_average * 10) / 10}</span>Rating</p>
    
                            </>
                        )}
                        <p className="mt-4 text-gray-300 p-4">{overview}</p>
                        <div className="mt-12"> {/* Increased margin top here */}
                            {renderStreamingProviders(details['watch/providers'])}
                        </div>
                    </div>
                </div>
                {showModal && adBlockerModal()}
            <div className="mt-4">
            <h2 className="text-xl">Cast</h2>
            <div className="flex overflow-x-auto space-x-4 p-2">
                {castList.map(actor => (
                    <div key={actor.cast_id} className="cast-card ">
                        <img src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`} alt={actor.name} className="w-20 h-full object-cover rounded-full" />
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
