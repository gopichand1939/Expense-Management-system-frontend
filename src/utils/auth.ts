// src/utils/auth.ts
export const saveToken = (token: string) => {
    localStorage.setItem('token', token);
  };
  
  export const getToken = (): string | null => {
    return localStorage.getItem('token');
  };
  
  export const isAuthenticated = (): boolean => {
    return !!getToken();
  };
  
  export const getRoleFromToken = (): string | null => {
    const token = getToken();
    if (!token) return null;
  
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.role;
    } catch {
      return null;
    }
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
  };
  