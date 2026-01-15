/**
 * Authentication utility for CMS
 * Simple client-side authentication using localStorage
 */

export interface Credentials {
  username: string;
  password: string;
}

const CREDENTIALS_KEY = 'cms_credentials';
const AUTH_KEY = 'cms_authenticated';
const USERNAME_KEY = 'cms_username';
const LOGIN_TIME_KEY = 'cms_login_time';

// Session timeout: 24 hours
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

/**
 * Get stored credentials
 */
export function getCredentials(): Credentials | null {
  try {
    const stored = localStorage.getItem(CREDENTIALS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading credentials:', e);
  }
  return null;
}

/**
 * Save credentials
 */
export function saveCredentials(credentials: Credentials): void {
  try {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
  } catch (e) {
    console.error('Error saving credentials:', e);
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const authenticated = localStorage.getItem(AUTH_KEY) === 'true';
  if (!authenticated) {
    return false;
  }

  // Check session timeout
  const loginTime = localStorage.getItem(LOGIN_TIME_KEY);
  if (loginTime) {
    const timeDiff = Date.now() - parseInt(loginTime, 10);
    if (timeDiff > SESSION_TIMEOUT) {
      logout();
      return false;
    }
  }

  return true;
}

/**
 * Login user
 */
export function login(username: string, password: string): boolean {
  const credentials = getCredentials();
  
  // If no credentials stored, use defaults
  if (!credentials) {
    const defaultCredentials: Credentials = {
      username: 'admin',
      password: 'admin123'
    };
    
    if (username === defaultCredentials.username && password === defaultCredentials.password) {
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(USERNAME_KEY, username);
      localStorage.setItem(LOGIN_TIME_KEY, Date.now().toString());
      return true;
    }
    return false;
  }

  // Check against stored credentials
  if (username === credentials.username && password === credentials.password) {
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(LOGIN_TIME_KEY, Date.now().toString());
    return true;
  }

  return false;
}

/**
 * Logout user
 */
export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(LOGIN_TIME_KEY);
}

/**
 * Get current username
 */
export function getCurrentUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

/**
 * Update password
 */
export function updatePassword(oldPassword: string, newPassword: string): boolean {
  const credentials = getCredentials();
  
  // If no credentials stored, use defaults
  if (!credentials) {
    const defaultCredentials: Credentials = {
      username: 'admin',
      password: 'admin123'
    };
    
    if (oldPassword === defaultCredentials.password) {
      saveCredentials({
        username: defaultCredentials.username,
        password: newPassword
      });
      return true;
    }
    return false;
  }

  // Check old password
  if (oldPassword === credentials.password) {
    saveCredentials({
      username: credentials.username,
      password: newPassword
    });
    return true;
  }

  return false;
}

/**
 * Update username
 */
export function updateUsername(newUsername: string, password: string): boolean {
  const credentials = getCredentials();
  
  // If no credentials stored, use defaults
  if (!credentials) {
    const defaultCredentials: Credentials = {
      username: 'admin',
      password: 'admin123'
    };
    
    if (password === defaultCredentials.password) {
      saveCredentials({
        username: newUsername,
        password: defaultCredentials.password
      });
      // Update current username if logged in
      if (isAuthenticated()) {
        localStorage.setItem(USERNAME_KEY, newUsername);
      }
      return true;
    }
    return false;
  }

  // Check password
  if (password === credentials.password) {
    saveCredentials({
      username: newUsername,
      password: credentials.password
    });
    // Update current username if logged in
    if (isAuthenticated()) {
      localStorage.setItem(USERNAME_KEY, newUsername);
    }
    return true;
  }

  return false;
}
