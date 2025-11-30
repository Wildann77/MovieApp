import API from "./axios-client";

export const registerUser = async (data) => {
    const response = await API.post("/auth/signup", data);
    return response.data;
};

export const loginUser = async (data) => {
    const response = await API.post("/auth/login", data);
    return response.data;
};


export const getCurrentUser = async () => {
    const response = await API.get(`/user/current`);
    return response.data; // axios interceptor already extracts data field
};


export const getAllMovies = async (params = {}) => {
    // Clean up empty parameters to avoid sending empty strings
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => 
            value !== null && value !== undefined && value !== ''
        )
    );
    
    // Add request timestamp for debugging
    const startTime = Date.now();
    
    try {
        const response = await API.get("/movies/all", { 
            params: cleanParams,
            timeout: 10000 // 10 second timeout
        });
        
        const endTime = Date.now();
        console.log(`getAllMovies request took ${endTime - startTime}ms with params:`, cleanParams);
        console.log('Director filter value:', cleanParams.director);
        
        // Returns: { data: [...], pagination: { pagination info } } (handled by axios interceptor)
        return response.data;
    } catch (error) {
        const endTime = Date.now();
        console.error(`getAllMovies failed after ${endTime - startTime}ms:`, error);
        throw error;
    }
};

export const getUserMovies = async (params = {}) => {
    // Clean up empty parameters to avoid sending empty strings
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => 
            value !== null && value !== undefined && value !== ''
        )
    );
    
    // Add request timestamp for debugging
    const startTime = Date.now();
    
    try {
        console.log("🚀 getUserMovies - Making API request with params:", cleanParams);
        console.log("🚀 getUserMovies - User ID being sent:", cleanParams.user);
        
        const response = await API.get("/movies/all", { 
            params: cleanParams,
            timeout: 10000 // 10 second timeout
        });
        
        const endTime = Date.now();
        console.log(`✅ getUserMovies request took ${endTime - startTime}ms with params:`, cleanParams);
        console.log('✅ getUserMovies - User filter value:', cleanParams.user);
        console.log('✅ getUserMovies - Response data:', response.data);
        console.log('✅ getUserMovies - Movies count in response:', response.data?.data?.length || 0);
        
        // Returns: { data: [...], pagination: { pagination info } } (handled by axios interceptor)
        return response.data;
    } catch (error) {
        const endTime = Date.now();
        console.error(`❌ getUserMovies failed after ${endTime - startTime}ms:`, error);
        console.error('❌ getUserMovies - Error details:', error.response?.data);
        throw error;
    }
};

export const searchMovies = async (searchQuery, params = {}) => {
    const response = await API.get("/movies/all", { 
        params: { 
            search: searchQuery, 
            limit: 10, // Limit search results for dropdown
            ...params 
        } 
    });
    return response.data;
};

export const searchActors = async (searchQuery, params = {}) => {
    const response = await API.get("/master-data/actors", { 
        params: { 
            search: searchQuery, 
            limit: 10, // Limit search results for dropdown
            ...params 
        } 
    });
    return response.data;
};

export const getAllcasts = async (params = {}) => {
    const response = await API.get("/master-data/actors", { params });
    return response.data;
}

export const getPublicCasts = async (params = {}) => {
    const response = await API.get("/master-data/public/casts", { params });
    return response.data;
}

export const getSingleMovie = async (movieId) => {
    const response = await API.get(`/movies/${movieId}`);
    return response.data; // axios interceptor already extracts data field
}

export const getMoviesByActor = async (actorId, params = {}) => {
    const response = await API.get(`/movies/actor/${actorId}`, { params });
    return response.data;
}

export const Logout = async () => {
    const response = await API.post("/auth/logout");
    return response.data;
}


export const createMovie = async (movieData, accessToken) => {
    const response = await API.post("/movies/create", movieData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const updateMovie = async (movieId, movieData, accessToken) => {
    const response = await API.put(`/movies/${movieId}`, movieData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const deleteMovie = async (movieId, accessToken) => {
    const response = await API.delete(`/movies/${movieId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

// ===== ACTORS =====
export const getAllActors = async (params = {}) => {
    const response = await API.get("/master-data/actors", { params });
    return response.data;
};

export const getActorById = async (actorId) => {
    const response = await API.get(`/master-data/public/actors/${actorId}`);
    return response.data; // axios interceptor already extracts data field
};

export const createActor = async (actorData) => {
    const response = await API.post("/master-data/actors", actorData);
    return response.data;
};

export const updateActor = async (actorId, actorData) => {
    const response = await API.put(`/master-data/actors/${actorId}`, actorData);
    return response.data;
};

export const deleteActor = async (actorId) => {
    const response = await API.delete(`/master-data/actors/${actorId}`);
    return response.data;
};

// ===== DIRECTORS =====
export const getAllDirectors = async (params = {}) => {
    const response = await API.get("/master-data/directors", { params });
    return response.data;
};

export const getDirectorById = async (directorId) => {
    const response = await API.get(`/master-data/directors/${directorId}`);
    return response.data; // axios interceptor already extracts data field
};

export const createDirector = async (directorData) => {
    const response = await API.post("/master-data/directors", directorData);
    return response.data;
};

export const updateDirector = async (directorId, directorData) => {
    const response = await API.put(`/master-data/directors/${directorId}`, directorData);
    return response.data;
};

export const deleteDirector = async (directorId) => {
    const response = await API.delete(`/master-data/directors/${directorId}`);
    return response.data;
};

// ===== WRITERS =====
export const getAllWriters = async (params = {}) => {
    const response = await API.get("/master-data/writers", { params });
    return response.data;
};

export const getWriterById = async (writerId) => {
    const response = await API.get(`/master-data/writers/${writerId}`);
    return response.data; // axios interceptor already extracts data field
};

export const createWriter = async (writerData) => {
    const response = await API.post("/master-data/writers", writerData);
    return response.data;
};

export const updateWriter = async (writerId, writerData) => {
    const response = await API.put(`/master-data/writers/${writerId}`, writerData);
    return response.data;
};

export const deleteWriter = async (writerId) => {
    const response = await API.delete(`/master-data/writers/${writerId}`);
    return response.data;
};

// ===== GENRES =====
export const getAllGenres = async (params = {}) => {
    const response = await API.get("/master-data/genres", { params });
    return response.data;
};

export const getGenreById = async (genreId) => {
    const response = await API.get(`/master-data/genres/${genreId}`);
    return response.data; // axios interceptor already extracts data field
};

export const createGenre = async (genreData) => {
    const response = await API.post("/master-data/genres", genreData);
    return response.data;
};

export const updateGenre = async (genreId, genreData) => {
    const response = await API.put(`/master-data/genres/${genreId}`, genreData);
    return response.data;
};

export const deleteGenre = async (genreId) => {
    const response = await API.delete(`/master-data/genres/${genreId}`);
    return response.data;
};

// ===== MASTER DATA (ALL) =====
export const getAllMasterData = async () => {
    const response = await API.get("/master-data");
    return response.data; // axios interceptor already extracts data field
};

export const getGlobalMasterData = async () => {
    const response = await API.get("/master-data/global");
    return response.data; // axios interceptor already extracts data field
};

// ===== REVIEWS =====
export const createReview = async (movieId, reviewData, accessToken) => {
    const response = await API.post(`/reviews/movie/${movieId}`, reviewData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const getMovieReviews = async (movieId, params = {}) => {
    const response = await API.get(`/reviews/movie/${movieId}`, { params });
    return response.data;
};

export const getUserMovieReview = async (movieId, accessToken) => {
    const response = await API.get(`/reviews/movie/${movieId}/user`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const updateReview = async (reviewId, reviewData, accessToken) => {
    const response = await API.put(`/reviews/${reviewId}`, reviewData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const deleteReview = async (reviewId, accessToken) => {
    const response = await API.delete(`/reviews/${reviewId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const toggleReviewLike = async (reviewId, accessToken) => {
    const response = await API.post(`/reviews/${reviewId}/like`, {}, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const getUserReviews = async (params = {}, accessToken) => {
    const response = await API.get("/reviews/user/reviews", { 
        params,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

// ===== FAVORITES =====
export const getUserFavorites = async (params = {}) => {
    const response = await API.get("/user/favorites", { params });
    console.log("Service - Raw response:", response);
    console.log("Service - Response data:", response.data);
    
    // Returns: { favorites: [...], pagination: { pagination info } } (handled by axios interceptor)
    return response.data;
};

export const addToFavorites = async (movieId) => {
    const response = await API.post(`/user/favorites/${movieId}`, {});
    return response.data;
};

export const removeFromFavorites = async (movieId) => {
    const response = await API.delete(`/user/favorites/${movieId}`);
    return response.data;
};

export const toggleFavorite = async (movieId) => {
    const response = await API.patch(`/user/favorites/${movieId}/toggle`, {});
    return response.data;
};

// ===== ADMIN API FUNCTIONS =====

// User Management
export const getAdminUsers = async (params = {}) => {
    const response = await API.get("/admin/users", { params });
    // Returns: { data: [...], pagination: { pagination info } } (handled by axios interceptor)
    return response.data;
};

export const updateUserRole = async (userId, role) => {
    const response = await API.put(`/admin/users/${userId}/role`, { role });
    return response.data;
};

export const toggleUserStatus = async (userId, isActive) => {
    const response = await API.put(`/admin/users/${userId}/status`, { isActive });
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await API.delete(`/admin/users/${userId}`);
    return response.data;
};

// Movie Management
export const getAdminMovies = async (params = {}) => {
    const response = await API.get("/admin/movies", { params });
    console.log("🔍 getAdminMovies response:", response.data);
    // Returns: { data: [...], pagination: { pagination info } } (handled by axios interceptor)
    return response.data;
};

export const createAnyMovie = async (movieData) => {
    const response = await API.post("/admin/movies", movieData);
    return response.data;
};

export const updateAnyMovie = async (movieId, movieData) => {
    const response = await API.put(`/admin/movies/${movieId}`, movieData);
    return response.data;
};

export const deleteAnyMovie = async (movieId) => {
    const response = await API.delete(`/admin/movies/${movieId}`);
    return response.data;
};

// Review Management
export const getAdminReviews = async (params = {}) => {
    const response = await API.get("/admin/reviews", { params });
    console.log("🔍 getAdminReviews response:", response.data);
    // Returns: { data: [...], pagination: { pagination info } } (handled by axios interceptor)
    return response.data;
};

export const deleteAnyReview = async (reviewId) => {
    const response = await API.delete(`/admin/reviews/${reviewId}`);
    return response.data;
};

// Report review
export const reportReview = async (reviewId, reason) => {
    const response = await API.post(`/reviews/${reviewId}/report`, {
        reason
    });
    return response.data;
};

// System Statistics
export const getSystemStats = async () => {
    const response = await API.get("/admin/stats");
    return response.data;
};

// ===== ADMIN MASTER DATA API FUNCTIONS =====

// Actors Management
export const getAdminActors = async (params = {}) => {
    const response = await API.get("/admin/master-data/actors", { params });
    console.log('🔍 getAdminActors response:', response.data);
    // Returns: { actors: [...], pagination: {...} } (handled by axios interceptor)
    return response.data;
};

export const createAdminActor = async (actorData) => {
    const response = await API.post("/admin/master-data/actors", actorData);
    return response.data;
};

export const updateAdminActor = async (actorId, actorData) => {
    const response = await API.put(`/admin/master-data/actors/${actorId}`, actorData);
    return response.data;
};

export const deleteAdminActor = async (actorId) => {
    const response = await API.delete(`/admin/master-data/actors/${actorId}`);
    return response.data;
};

// Directors Management
export const getAdminDirectors = async (params = {}) => {
    const response = await API.get("/admin/master-data/directors", { params });
    console.log('🔍 getAdminDirectors response:', response.data);
    // Returns: { directors: [...], pagination: {...} } (handled by axios interceptor)
    return response.data;
};

export const createAdminDirector = async (directorData) => {
    const response = await API.post("/admin/master-data/directors", directorData);
    return response.data;
};

export const updateAdminDirector = async (directorId, directorData) => {
    const response = await API.put(`/admin/master-data/directors/${directorId}`, directorData);
    return response.data;
};

export const deleteAdminDirector = async (directorId) => {
    const response = await API.delete(`/admin/master-data/directors/${directorId}`);
    return response.data;
};

// Writers Management
export const getAdminWriters = async (params = {}) => {
    const response = await API.get("/admin/master-data/writers", { params });
    console.log('🔍 getAdminWriters response:', response.data);
    // Returns: { writers: [...], pagination: {...} } (handled by axios interceptor)
    return response.data;
};

export const createAdminWriter = async (writerData) => {
    const response = await API.post("/admin/master-data/writers", writerData);
    return response.data;
};

export const updateAdminWriter = async (writerId, writerData) => {
    const response = await API.put(`/admin/master-data/writers/${writerId}`, writerData);
    return response.data;
};

export const deleteAdminWriter = async (writerId) => {
    const response = await API.delete(`/admin/master-data/writers/${writerId}`);
    return response.data;
};

// Genres Management
export const getAdminGenres = async (params = {}) => {
    const response = await API.get("/admin/master-data/genres", { params });
    console.log('🔍 getAdminGenres response:', response.data);
    // Returns: { genres: [...], pagination: {...} } (handled by axios interceptor)
    return response.data;
};

export const createAdminGenre = async (genreData) => {
    const response = await API.post("/admin/master-data/genres", genreData);
    return response.data;
};

export const updateAdminGenre = async (genreId, genreData) => {
    const response = await API.put(`/admin/master-data/genres/${genreId}`, genreData);
    return response.data;
};

export const deleteAdminGenre = async (genreId) => {
    const response = await API.delete(`/admin/master-data/genres/${genreId}`);
    return response.data;
};