import { defineConfig } from 'astro/config';

export default defineConfig({
  // Output static HTML to match original behavior
  output: 'static',
  
  // Site URL for Open Graph and canonical links
  site: 'https://notjavas.github.io',
});
