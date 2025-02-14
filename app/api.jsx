const BASE_URL = 'https://api.themoviedb.org/3';


const checkVideoAvailability = async (mediaType, itemId) => {
  const videoUrl = `https://vidsrc.xyz/embed/${mediaType}/${itemId}`;
  try {
    const response = await fetch(videoUrl);
    //console.log(`Status for ${itemId}:`, response.status); // Log status
    return response.status === 200;  // Check if the status is exactly 200 for available content
  } catch (error) {
    //console.error("Failed to check video availability:", error);
    return false;
  }

  // //IF VID SRC IS DOWN, JUST RETURN TRUE
  // return true;
};


export const fetchTrendingMedia = async (mediaType, page) => {
  const url = `${BASE_URL}/trending/${mediaType}/week?api_key=${process.env.NEXT_PUBLIC_API_KEY}&append_to_response=credits,images,videos&page=${page}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch data');
  let data = await response.json();

  // Check availability of each media item on vidsrc.to
  const availability = await Promise.all(data.results.map(item =>
      checkVideoAvailability(mediaType || item.media_type, item.id)
  ));

  // Filter results to only include items that are available
  data.results = data.results.filter((item, index) => availability[index]);

  return data;
};


export const fetchGenres = async (mediaType) => {
  const url = `${BASE_URL}/genre/${mediaType}/list?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch data');
  return await response.json();
}

export const fetchGenreMedia = async (mediaType, genreId, page) => {
  const url = `${BASE_URL}/discover/${mediaType}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&with_genres=${genreId}&page=${page}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch data');
  let data = await response.json();

  // Check availability of each media item on vidsrc.to
  const availability = await Promise.all(data.results.map(item =>
      checkVideoAvailability(mediaType || item.media_type, item.id)
  ));

  // Filter results to only include items that are available
  data.results = data.results.filter((item, index) => availability[index]);

  return data;
};


export const fetchMediaDetails = async (mediaType, id) => {
  console.log("MEDIA TYPE: ", mediaType);
  const appendResponse = mediaType === 'tv' ? 'credits,images,videos,watch/providers,seasons' : 'credits,images,videos,watch/providers';
  const url = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&append_to_response=${appendResponse}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch data');
  return await response.json();
}

export const fetchMediaDetailsWithTrailer = async (mediaType, id) => {
  const appendResponse = mediaType === 'tv' ? 'credits,images,videos,watch/providers,seasons' : 'credits,images,videos,watch/providers';
  const url = `${BASE_URL}/${mediaType}/${id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&append_to_response=${appendResponse}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch data');

  const data = await response.json();
  const trailers = data.videos.results.filter(video => video.type === 'Trailer' && video.site === 'YouTube');
  const trailerUrl = trailers.length > 0 ? `https://www.youtube.com/embed/${trailers[0].key}` : '';

  return { ...data, trailerUrl };
};

export const fetchSearchResults = async (query) => {
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${query}`
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch data');
  let data = await response.json();
  // console.log(data)
  // Check availability of each media item on vidsrc.to
  const availability = await Promise.all(data.results.map(item =>
    checkVideoAvailability(item.media_type, item.id)
  ));

  // Filter results to only include items that are available
  data.results = data.results.filter((item, index) => availability[index]);

  return data;
  }


export const fetchSeasonDetails = async (mediaType, id, seasonNumber) => {
  if (mediaType !== 'tv') return; // Only fetch seasons for TV shows
  const url = `${BASE_URL}/${mediaType}/${id}/season/${seasonNumber}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch season details');
  return await response.json();
};


export const fetchTopRatedMedia = async (mediaType, page) => {
  const url = `${BASE_URL}/${mediaType}/top_rated?api_key=${process.env.NEXT_PUBLIC_API_KEY}&append_to_response=credits,images,videos&page=${page}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch data');
  let data = await response.json();

  // Check availability of each media item on vidsrc.to
  const availability = await Promise.all(data.results.map(item =>
      checkVideoAvailability(mediaType || item.media_type, item.id)
  ));

  // Filter results to only include items that are available
  data.results = data.results.filter((item, index) => availability[index]);

  return data;
};


export const fetchWatchHistoryDetails = async (watchHistory) => {
  const detailsPromises = watchHistory.map(async (item) => {
    const url = `${BASE_URL}/${item.mediatype}/${item.mediaid}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch data for ${item.mediatype} ${item.mediaid}`);
    const data = await response.json();
    return {
      ...data,
      mediaType: item.mediatype,
    };
  });

  return Promise.all(detailsPromises);
};
/////////////////////////////////
////////////////////////////////
////////////////////////////////

export async function fetchUsers() {
  try {
    const timestamp = Date.now(); // Get the current timestamp
    const response = await fetch(`/api/get-users?tid=${timestamp}`, { next: {revalidate: 1 } });
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}


export async function addUser(user) {
  try {
    const response = await fetch('/api/add-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (response.status === 409) {
      throw new Error('Username is already taken.');
    }

    if (!response.ok) {
      throw new Error('Failed to add user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding user:', error);
    return { error: error.message };
  }
}