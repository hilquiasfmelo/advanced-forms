import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://xxguravoibgntajbuxir.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4Z3VyYXZvaWJnbnRhamJ1eGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MDc4NDcyNywiZXhwIjoxOTk2MzYwNzI3fQ.ym3f0AunaY17qS7o2VGfx4kM6BqBpfH8OTZ4l9NJgJw"
);
