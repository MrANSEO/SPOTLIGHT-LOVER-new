import api from './api';

/**
 * Service pour la gestion des vidéos/candidats
 * Note: Le backend utilise le endpoint /candidates
 */

// Get all videos/candidates
export const getVideos = async (params = {}) => {
  try {
    const response = await api.get('/candidates', { params });
    return {
      success: true,
      data: {
        videos: response.data.data || response.data,
        total: response.data.meta?.total || response.data.length,
        page: response.data.meta?.page || 1,
        limit: response.data.meta?.limit || 10
      }
    };
  } catch (error) {
    console.error('Get videos error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors du chargement des vidéos'
    };
  }
};

// Get video by ID
export const getVideoById = async (id) => {
  try {
    const response = await api.get(`/candidates/${id}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Get video by ID error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Vidéo introuvable'
    };
  }
};

// Upload video (create candidate)
export const uploadVideo = async (formData, onUploadProgress) => {
  try {
    const response = await api.post('/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Upload video error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors de l\'upload'
    };
  }
};

// Update video
export const updateVideo = async (id, data) => {
  try {
    const response = await api.patch(`/candidates/${id}`, data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Update video error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors de la mise à jour'
    };
  }
};

// Delete video
export const deleteVideo = async (id) => {
  try {
    const response = await api.delete(`/candidates/${id}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Delete video error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors de la suppression'
    };
  }
};

// Get my videos
export const getMyVideos = async () => {
  try {
    const response = await api.get('/candidates/my-videos');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Get my videos error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors du chargement'
    };
  }
};

// Get video stats
export const getVideoStats = async (id) => {
  try {
    const response = await api.get(`/candidates/${id}/stats`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Get video stats error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors du chargement des stats'
    };
  }
};

// Export default as an object for destructuring
export const videosService = {
  getVideos,
  getVideoById,
  uploadVideo,
  updateVideo,
  deleteVideo,
  getMyVideos,
  getVideoStats
};

export default videosService;
