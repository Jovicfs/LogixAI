const API_BASE_URL = 'http://localhost:5000';

export const apiClient = async (endpoint, options = {}) => {
    const defaultOptions = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error('API call failed');
    }

    return response.json();
};

export const auth = {
    login: (credentials) => apiClient('/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    logout: () => apiClient('/logout', {
        method: 'POST',
        credentials: 'include'
    }),
    checkSession: () => apiClient('/verify-session')
};
