import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://sustainable-action.ngo',
  image: {
    remotePatterns: [{
      protocol: "https"
    }]
  },
})