// pages/watch-now.js
'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';


function WatchNowFallback() {
  return <div>Loading search results...</div>;
}

const WatchNow = () => {
  return (
      <Suspense fallback={<WatchNowFallback />}>
          <WatchContent />
      </Suspense>
  );
};

const WatchContent = () => {
    const watchParams = useSearchParams();
    const mediaType = watchParams.get('media');
    const id = watchParams.get('id');
    console.log(mediaType, id);
    
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const videoUrl = `https://vidsrc.to/embed/${mediaType}/${id}`;
  
    useEffect(() => {
      if (mediaType && id) {
        fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=2ac6c7454620266df100979cb35f5298&append_to_response=credits,images,videos`)
          .then(response => response.json())
          .then(setDetails)
          .catch(setError)
          .finally(() => setLoading(false));
      }
    }, [mediaType, id]);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!details) return <p>No details available.</p>;

    
    const { title, name, credits, release_date, poster_path, overview, runtime, vote_average, backdrop_path } = details;
    const year = release_date ? `(${new Date(release_date).getFullYear()})` : '';

    return (
      <div className="mt-5 bg-black text-white min-h-screen">
        <div className="relative pt-16 pb-6 flex flex-col items-center justify-center bg-cover" style={{ backgroundImage: `url('https://image.tmdb.org/t/p/original${details.backdrop_path}')` }}>
          {/* Opacity Layer */}
          <div className="absolute inset-0 bg-black bg-opacity-80"></div>
          
          {/* Video Player Container */}
          <div className="video-container z-10">
            <iframe src={videoUrl} frameBorder="0" allowFullScreen></iframe>
          </div>
  
          <h1 className="text-3xl font-bold mt-4 z-10 text-primary-orange">{details.title || details.name} {year}</h1>
          <p className="px-4 text-left z-10">{details.overview}</p>
        </div>
        <div className="flex overflow-x-auto gap-4 p-4">
          {details.credits?.cast.slice(0, 16).map(actor => (
            <div key={actor.cast_id} className="min-w-max">
              <img src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`} alt={actor.name} className="w-24 h-24 rounded-full object-cover" />
              <div className="text-center">
                <p className="font-bold">{actor.name}</p>
                <p className="text-sm">{actor.character}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default WatchNow;
