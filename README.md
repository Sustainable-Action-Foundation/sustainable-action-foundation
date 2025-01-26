# Sustainable action foundation webpage

## Working with Astro 

### 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

### 🧞 Commands

All commands are run from the root of the project, from
 a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
 
 ## Working with PocketBase
We use PocketBase as a very lightweight CMS.  

### Set up working enviroment
The following steps apply assuming you have a **sustainable-action-foundation.pockethost.io** account. If not, contact: <a href="https://github.com/Axelgustavschnurer">@Axelgustavschnurer</a>

1. Download the latest release of PocketBase v.0.22 from <a href="https://github.com/pocketbase/pocketbase/releases">pocketbase on github</a> into the root of this project. 
2. Extract the files into `/pocketbase` and create the path: `/pocketbase/pb_data/`.
3. Head to the current <a href="https://sustainable-action-foundation.pockethost.io/_/#/settings/backups
">live version</a> of our pocketbase instance and download the latest backup.
4. Extract the backup and copy the files to: `/pocketbase/pb_data/`.
5. Setup the following enviroment variables:

    - `PB_URL=""` *(http://127.0.0.1/8090 by default)*
    - `PB_PASSWORD=""`
    - `PB_USERNAME=""`

6. Open the PocketBase server using `pocketbase serve`.

## Themes
Grönt, bakgrund,
blått, huvudfärg
Stadstema på tematiska bilder

## Sources
https://plus.unsplash.com/premium_photo-1697729828023-35f1eb84db3e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
https://visitsweden.com/_next/image/?url=https%3A%2F%2Fs3-eu-north-1.amazonaws.com%3A443%2Fpy3.visitsweden.com%2Foriginal_images%2F_DSC4801_CopyrightSteampipeProductionStudio_tif_CMSTemplate_QvrJEQn.jpg&w=1980&q=75
https://malmo.se/images/18.7595c891188fbebc4fa88690/1695724614046/MicrosoftTeams-image%20(25)1.jpg
https://img.freepik.com/premium-photo/blur-colorful-background-gradient-blurred-colorful-with-grain-noise-effect_558873-5103.jpg?semt=ais_hybrid
https://unsplash.com/photos/wind-turbine-surrounded-by-grass-WYGhTLym344