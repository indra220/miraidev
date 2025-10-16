// src/utils/auth-utils.ts

// Fungsi untuk menyimpan role ke sessionStorage
export const setRoleToStorage = (role: string): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('userRole', role);
  }
};

// Fungsi untuk mengambil role dari sessionStorage
export const getRoleFromStorage = (): string | null => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('userRole');
  }
  return null;
};

// Fungsi untuk menghapus role dari sessionStorage
export const removeRoleFromStorage = (): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('userRole');
  }
};

// Fungsi untuk menyimpan informasi login ke sessionStorage
export const setAuthInfoToStorage = (role: string, userId: string): void => {
  if (typeof window !== 'undefined') {
    setRoleToStorage(role);
    sessionStorage.setItem('userId', userId);
  }
};

// Fungsi untuk mengambil informasi login dari sessionStorage
export const getAuthInfoFromStorage = (): { role: string | null; userId: string | null } => {
  if (typeof window !== 'undefined') {
    const role = getRoleFromStorage();
    const userId = sessionStorage.getItem('userId');
    return { role, userId };
  }
  return { role: null, userId: null };
};

// Fungsi untuk membersihkan semua informasi auth dari sessionStorage
export const clearAuthInfoFromStorage = (): void => {
  if (typeof window !== 'undefined') {
    removeRoleFromStorage();
    sessionStorage.removeItem('userId');
  }
};