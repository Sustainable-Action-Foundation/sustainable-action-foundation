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

Grönt, bakgrund,
blått, huvudfärg
Stadstema på tematiska bilder