// Fungsi bantuan untuk validasi umum
export const validationHelpers = {
  required: (message = "Bidang ini wajib diisi") => ({
    rule: (value: string) => value.trim() !== '',
    message,
    level: 'error' as const
  }),
  
  minLength: (min: number, message?: string) => ({
    rule: (value: string) => value.length >= min,
    message: message || `Minimal ${min} karakter`,
    level: 'error' as const
  }),
  
  maxLength: (max: number, message?: string) => ({
    rule: (value: string) => value.length <= max,
    message: message || `Maksimal ${max} karakter`,
    level: 'warning' as const
  }),
  
  email: (message = "Format email tidak valid") => ({
    rule: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
    level: 'error' as const
  }),
  
  phone: (message = "Format nomor telepon tidak valid") => ({
    rule: (value: string) => /^[+]?[1-9][0-9]{0,15}$/.test(value.replace(/\s/g, '')),
    message,
    level: 'error' as const
  }),
  
  passwordStrength: (message = "Kata sandi harus mengandung huruf besar, huruf kecil, angka, dan simbol") => ({
    rule: (value: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value),
    message,
    level: 'warning' as const
  })
};