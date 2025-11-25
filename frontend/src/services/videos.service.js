import api from './api';

// Get all videos
export const getVideos = async (params = {}) => {
  const response = await api.get('/videos', { params });
  return response.data;
};

// Get video by ID
export const getVideoById = async (id) => {
  const response = await api.get(`/videos/${id}`);
  return response.data;
};

// Upload video
export const uploadVideo = async (formData, onUploadProgress) => {
  const response = await api.post('/videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
  return response.data;
};

// Update video
export const updateVideo = async (id, data) => {
  const response = await api.patch(`/videos/${id}`, data);
  return response.data;
};

// Delete video
export const deleteVideo = async (id) => {
  const response = await api.delete(`/videos/${id}`);
  return response.data;
};

// Get my videos
export const getMyVideos = async () => {
  const response = await api.get('/videos/my-videos');
  return response.data;
};
