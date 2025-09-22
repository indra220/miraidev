export function checkEnvironmentVariables() {
  const requiredEnvVars = {
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    ai: {
      openai: process.env.OPENAI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY,
    },
  };

  const status = {
    supabase: !!(
      requiredEnvVars.supabase.url && 
      requiredEnvVars.supabase.anonKey &&
      requiredEnvVars.supabase.serviceRoleKey
    ),
    ai: !!(requiredEnvVars.ai.openai || requiredEnvVars.ai.anthropic),
    allConfigured: false,
  };

  status.allConfigured = status.supabase && status.ai;

  return status;
}

export function getSetupInstructions() {
  return [
    {
      service: "Supabase",
      description: "Database dan sistem autentikasi",
      steps: [
        "Buka https://supabase.com/dashboard",
        "Buat proyek baru",
        "Salin NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY ke .env.local",
        "Dapatkan SUPABASE_SERVICE_ROLE_KEY dari pengaturan API proyek Anda",
      ],
      envVars: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"],
    },
    {
      service: "OpenAI",
      description: "Model bahasa AI untuk fungsionalitas chat",
      steps: [
        "Buka https://platform.openai.com/",
        "Buat kunci API",
        "Salin OPENAI_API_KEY ke .env.local",
      ],
      envVars: ["OPENAI_API_KEY"],
    },
  ];
}
