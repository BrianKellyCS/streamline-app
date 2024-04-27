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
  const url = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&append_to_response=credits,images,videos,watch/providers`
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
