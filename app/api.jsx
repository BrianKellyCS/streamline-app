const BASE_URL = 'https://api.themoviedb.org/3';



export const fetchTrendingMedia = async (mediaType, page) => {
  const url = `${BASE_URL}/trending/${mediaType}/week?api_key=${process.env.NEXT_PUBLIC_API_KEY}&append_to_response=credits,images,videos&page=${page}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch data');
  return await response.json();
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
  if (!response.ok) throw new Error('Error fetching genre media');
  return await response.json();
};


export const fetchMediaDetails = async (mediaType, id) => {
  const url = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&append_to_response=credits,images,videos`
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch data');
  return await response.json();
}

export const fetchSearchResults = async (query) => {
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${query}`
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch data');
  return await response.json();
}
