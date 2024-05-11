/** @format */

import { serve } from "aleph/server";
import react from "aleph/plugins/react";

serve({
  plugins: [
    react({ ssr: true }),
  ],
});
