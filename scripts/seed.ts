import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";
import resources from "./core-resources.json";

loadEnvConfig(process.cwd());

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Set ${name} in .env.local before seeding resources.`);
  return value;
}

const supabaseUrl = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
const serviceKey = requiredEnv("SUPABASE_SECRET_KEY");

if (resources.length !== 50) {
  throw new Error(`Expected exactly 50 resources, found ${resources.length}.`);
}

async function seedResources() {
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from("core_resources").upsert(resources, { onConflict: "url" });

  if (error) {
    throw new Error(`Resource seed failed: ${error.message}`);
  }

  console.log(`Seeded ${resources.length} Nexus resources.`);
}

seedResources().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
