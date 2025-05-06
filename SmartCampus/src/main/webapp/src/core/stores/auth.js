import { defineStore } from 'pinia';
import {
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  getUserInfo as storageGetUserInfo,
  setUserInfo as storageSetUserInfo,
  removeUserInfo as storageRemoveUserInfo,
  getPermissions as storageGetPermissions,
  setPermissions as storageSetPermissions,
  getRoles as storageGetRoles,
  setRoles as storageSetRoles,
  clearAuth as storageClearAuth,
  logout as apiLogout,
} from '@/core/utils/auth';
import { post, get } from '@/core/utils/request'; // Import post and get

// Example: Mock API calls - Replace with actual API calls
const apiLogin = (credentials) => {
  // IMPORTANT: Replace with your actual backend login API call
  // Should return a promise resolving to { token, refreshToken, userInfo: { id, username, permissions: [...] } }
  return post('/api/auth/login', credentials).then(res => {
     // Ensure the response structure matches what's expected
     // Adjust this based on your actual login API response format
     if (res.code === 200 || res.code === 0) {
       return res.data; // Expecting { token, refreshToken, userInfo }
     } else {
       throw new Error(res.message || 'Login failed');
     }
  });
};

// Actual implementation for fetching user info
const apiFetchUserInfo = () => {
  // Make GET request to the backend endpoint
  return get('/api/auth/me') // Assuming the endpoint is /api/auth/me
    .then(res => {
      // The request utility passes the entire Result object if code is 200/0
      // We need to extract the actual UserProfileDTO from the 'data' field
      const userProfileData = res.data;
      
      // Check if the extracted data looks like valid user info
      if (userProfileData && userProfileData.id) { 
        return userProfileData; // Return the UserProfileDTO: { id, username, roles, permissions, ... }
      } else {
        // This case might happen if backend returns success code but empty/invalid data
        console.error("apiFetchUserInfo received unexpected data field:", userProfileData);
        throw new Error('Failed to retrieve valid user profile data from response data field.');
      }
    });
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getToken() || null,
    refreshToken: getRefreshToken() || null,
    user: storageGetUserInfo() || null, // { id, username, permissions: [...], roles: [...] }
    isAuthenticated: !!getToken(),
    loading: false,
    error: null,
  }),
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
    permissions: (state) => state.user?.permissions || [],
    roles: (state) => state.user?.roles || [],
    isLoading: (state) => state.loading,
    authError: (state) => state.error,
  },
  actions: {
    /**
     * Login action
     * @param {object} credentials - { username, password }
     */
    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        // apiLogin returns the LoginResponseDTO: { accessToken: '...', tokenType: 'Bearer' }
        const loginResponse = await apiLogin(credentials); 

        // --- DEBUGGING LINE --- 
        console.log('Login response from apiLogin:', loginResponse);
        // --- END DEBUGGING LINE --- 

        // Check for accessToken instead of token
        if (!loginResponse || !loginResponse.accessToken) { 
          throw new Error('Login response did not contain an access token.'); // Updated error message
        }

        // Use accessToken instead of token
        const token = loginResponse.accessToken;
        // Assuming refreshToken and userInfo are NOT returned by /api/auth/login directly
        // We will fetch userInfo separately.
        const refreshToken = loginResponse.refreshToken; // Handle if backend sends it

        // Store token in state
        this.token = token; // State field is still named 'token'
        if (refreshToken) this.refreshToken = refreshToken;
        this.isAuthenticated = true;

        // Persist token to local storage (using the extracted token)
        setToken(token);
        if (refreshToken) setRefreshToken(refreshToken);

        // --- Fetch user info AFTER setting the token ---
        await this.fetchUserInfo(); // Fetch user details using the new token
        // fetchUserInfo should handle setting this.user and persisting it

        return this.user; // Return the fetched user info

      } catch (error) {
        // Log the actual error object for more details
        console.error('Login failed in action:', error);
        this.error = error.message || 'Failed to login';
        this.isAuthenticated = false;
        storageClearAuth(); // Clear any partial tokens
        throw error; // Re-throw for component handling
      } finally {
        this.loading = false;
      }
    },

    /**
     * Logout action
     */
    async logout() {
      this.loading = true;
      try {
        await apiLogout(); // Call the API logout from auth utils
      } catch (error) {
        console.error("Error calling API logout:", error);
        // Proceed with local cleanup even if API call fails
      } finally {
        this.token = null;
        this.refreshToken = null;
        this.user = null;
        this.isAuthenticated = false;
        storageClearAuth(); // Ensure local storage is cleared
        this.loading = false;
        // Optionally redirect: router.push('/login');
      }
    },

    /**
     * Fetches current user info (e.g., on app load if token exists)
     */
    async fetchUserInfo() {
       if (!this.token) {
         return; // No token, cannot fetch
       }
      this.loading = true;
      this.error = null;
      try {
        // Optionally verify token validity here first?
        const userInfo = await apiFetchUserInfo();
        this.user = userInfo;
        this.isAuthenticated = true; // Assume token is valid if fetch succeeds

        // Update local storage
        storageSetUserInfo(userInfo);
        if (userInfo.permissions) storageSetPermissions(userInfo.permissions);
        if (userInfo.roles) storageSetRoles(userInfo.roles);

      } catch (error) {
        this.error = 'Failed to fetch user info. Token might be invalid.';
        console.error(this.error, error);
        // Token might be invalid, log out
        await this.logout();
      } finally {
        this.loading = false;
      }
    },

     /**
     * Updates the store after a successful token refresh
     * (Called externally, e.g., by the request interceptor)
     * @param {string} newToken
     * @param {string} newRefreshToken (optional)
     */
     async handleTokenRefresh(newToken, newRefreshToken) {
       this.token = newToken;
       setToken(newToken);
       if (newRefreshToken) {
         this.refreshToken = newRefreshToken;
         setRefreshToken(newRefreshToken);
       }
       // Optionally re-fetch user info if needed after refresh
       // await this.fetchUserInfo();
       this.isAuthenticated = true; // Mark as authenticated again
     },

     /**
     * Checks if the user has a specific permission.
     * @param {string} permissionString - The permission string to check.
     * @returns {boolean} - True if the user has the permission, false otherwise.
     */
     hasPermission(permissionString) {
        return this.permissions.includes(permissionString);
     },

     /**
     * Checks if the user has ANY of the specified permissions.
     * @param {string[]} permissionsArray - An array of permission strings to check.
     * @returns {boolean} - True if the user has at least one of the permissions, false otherwise.
     */
     hasAnyPermission(permissionsArray) {
        if (!Array.isArray(permissionsArray) || permissionsArray.length === 0) {
            return false;
        }
        return permissionsArray.some(p => this.permissions.includes(p));
     },

     /**
     * Checks if the user has ALL of the specified permissions.
     * @param {string[]} permissionsArray - An array of permission strings to check.
     * @returns {boolean} - True if the user has all the permissions, false otherwise.
     */
     hasAllPermissions(permissionsArray) {
        if (!Array.isArray(permissionsArray) || permissionsArray.length === 0) {
            return true; // No permissions required means condition is met
        }
        return permissionsArray.every(p => this.permissions.includes(p));
     },
  },
});

// Helper to use outside setup functions (use sparingly)
export function useAuthStoreOutsideSetup() {
  // You might need to pass the pinia instance if used very early in app lifecycle
  // import { piniaInstance } from '@/main'; // Example
  // return useAuthStore(piniaInstance);
  return useAuthStore();
} 