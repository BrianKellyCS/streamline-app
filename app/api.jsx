const BASE_URL = 'https://api.themoviedb.org/3';


const checkVideoAvailability = async (mediaType, itemId) => {
  const videoUrl = `https://vidsrc.to/embed/${mediaType}/${itemId}`;
  try {
    const response = await fetch(videoUrl);
    //console.log(`Status for ${itemId}:`, response.status); // Log status
    return response.status === 200;  // Check if the status is exactly 200 for available content
  } catch (error) {
    //console.error("Failed to check video availability:", error);
    return false;
  }
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


export async function fetchUsers() {
  try {
    const response = await fetch('/api/get-users', { cache: 'no-store' });
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

    if (!response.ok) {
      throw new Error('Failed to add user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding user:', error);
    return null;
  }
}