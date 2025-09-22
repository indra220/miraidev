// Placeholder untuk user management tanpa Clerk
export interface User {
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
}

export async function getCurrentUser(): Promise<User | null> {
  // Untuk saat ini, kita kembalikan null karena tidak ada autentikasi
  // Di masa depan, ini bisa diimplementasikan dengan sistem auth lain
  return null;
}

// Fungsi untuk mendapatkan user berdasarkan ID
export async function getUserById(): Promise<User | null> {
  // Implementasi untuk mendapatkan user dari database
  // Untuk saat ini hanya placeholder
  return null;
}
