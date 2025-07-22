import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import inject from '@rollup/plugin-inject';
import ViteFaviconsInject from 'vite-plugin-favicons-inject';

const TITLE = 'MKKP Plakátszerkesztő';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  // Use 'src' as the root directory for source files
  root: 'src',

  // Configure the build output directory relative to the root
  build: {
    outDir: '../dist',
    emptyOutDir: true, // Replaces CleanWebpackPlugin
  },

  plugins: [
    // Replaces webpack.ProvidePlugin to inject global modules
    // Note: The modern approach is to `import $ from 'jquery'` where needed.
    inject({
      $: 'jquery',
      _: 'lodash',
    }),

    // Replaces HtmlWebpackPlugin and handles .ejs templating
    createHtmlPlugin({
      minify: true,
      // The entry point is now specified here
      entry: 'app.js',
      // The template file (must be inside the `root` directory)
      template: 'views/index.ejs',
      inject: {
        // You can inject data into your .ejs file like this
        data: {
          title: TITLE,
          // In your EJS template, you can use `<%= title %>`
        },
      },
    }),

    // Replaces FaviconsWebpackPlugin. Runs only during `vite build`.
    // Use a conditional to only run plugins in build, similar to your PROD flag.
    command === 'build' && ViteFaviconsInject('./img/kutyafej_icon.png', {
      appName: TITLE,
      appShortName: TITLE,
      start_url: '.',
    }),
  ],
}));