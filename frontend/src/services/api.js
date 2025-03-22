// src/services/api.js
import axios from 'axios';

// Set base URL for API calls
axios.defaults.baseURL = 'http://localhost:8000';

// Function to get authentication headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No authentication token found');
    return {};
  }
  return { Authorization: `Token ${token}` };
};

// Signup API call
export const signup = async (userData) => {
  try {
    const response = await axios.post('/api/signup/', userData);
    return response.data;
  } catch (error) {
    console.error('Error during signup:', error.response?.data || error.message);
    throw error;
  }
};

// Experiment related API calls
export const getExperiments = async () => {
  try {
    const response = await axios.get('/api/experiments/', { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching experiments:', error.response?.data || error.message);
    throw error;
  }
};

export const getExperiment = async (id) => {
  try {
    const response = await axios.get(`/api/experiments/${id}/`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error(`Error fetching experiment ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Video related API calls
export const getVideos = async () => {
  try {
    const response = await axios.get('/api/videos/', { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching videos:', error.response?.data || error.message);
    throw error;
  }
};

export const getVideo = async (id) => {
  try {
    const response = await axios.get(`/api/videos/${id}/`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error(`Error fetching video ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const updateVideoProgress = async (videoId, watchedSeconds, completed) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      throw new Error('User not authenticated or missing ID');
    }

    const payload = {
      video: videoId,
      watched_seconds: watchedSeconds,
      completed,
     // user: user.id,
    };
    console.log('Sending video progress:', payload);

    const response = await axios.post('/api/video-progress/', payload, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error updating video progress:', error.response?.data || error.message);
    throw error;
  }
};

// Footnote related API calls
export const recordFootnoteInteraction = async (footnoteId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      throw new Error('User not authenticated or missing ID');
    }

    const response = await axios.post('/api/footnote-interaction/', {
      footnote: footnoteId,
      user: user.id,
    }, { headers: getAuthHeaders() });

    return response.data;
  } catch (error) {
    console.error('Error recording footnote interaction:', error.response?.data || error.message);
    throw error;
  }
};

// Questionnaire related API calls
export const getQuestionnaire = async (videoId) => {
  try {
    const response = await axios.get(`/api/questionnaires/?video_id=${videoId}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error(`Error fetching questionnaire for video ${videoId}:`, error.response?.data || error.message);
    throw error;
  }
};

export const submitAnswers = async (answers) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      throw new Error('User not authenticated or missing ID');
    }

    const answersWithUser = answers.map(answer => ({
      ...answer,
      user: user.id,
    }));

    const response = await axios.post('/api/submit-answers/', { answers: answersWithUser }, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error submitting answers:', error.response?.data || error.message);
    throw error;
  }
};
