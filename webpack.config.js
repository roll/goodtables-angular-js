// Helper: root() is defined at the bottom
var path = require('path');
var webpack = require('webpack');

// Webpack Plugins
var autoprefixer = require('autoprefixer');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV = process.env.npm_lifecycle_event;
var isTestWatch = ENV === 'test-watch';
var isTest = ENV === 'test' || isTestWatch;
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {
  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  var config = {};

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  if (isProd) {
    config.devtool = 'source-map';
  }
  else if (isTest) {
    config.devtool = 'inline-source-map';
  }
  else {
    config.devtool = 'eval-source-map';
  }

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   */
  config.entry = isTest ? {} : {
    'goodtables-angular': './src/main.ts',
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
  };

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   */
  config.output = isTest ? {} : {
    path: root('dist'),
    publicPath: 'dist',
    filename: isProd ? '[name].min.js' : '[name].js',
  };

  /**
   * Resolve
   * Reference: http://webpack.github.io/docs/configuration.html#resolve
   */
  config.resolve = {
    // only discover files that have those extensions
    extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html'],
  };

  var atlOptions = '';
  if (isTest && !isTestWatch) {
    // awesome-typescript-loader needs to output inlineSourceMap for code coverage to work with source maps.
    atlOptions = 'inlineSourceMap=true&sourceMap=false';
  }

  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */
  config.module = {
    rules: [
      // Support for .ts files.
      {
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader?' + atlOptions,
          'angular2-template-loader',
          '@angularclass/hmr-loader',
        ],
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 32768,
          name: '[name].[ext]?[hash]'
        }
      },
    ]
  };

  if (isTest && !isTestWatch) {
    // instrument only testing sources with Istanbul, covers ts files
    config.module.rules.push({
      test: /\.ts$/,
      enforce: 'post',
      include: path.resolve('src'),
      loader: 'istanbul-instrumenter-loader',
      exclude: [/\.spec\.ts$/, /\.e2e\.ts$/, /node_modules/]
    });
  }

  if (!isTest || !isTestWatch) {
    // tslint support
    config.module.rules.push({
      test: /\.ts$/,
      enforce: 'pre',
      loader: 'tslint-loader'
    });
  }

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [
    // Define env variables to help with builds
    // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      // Environment helpers
      'process.env': {
        ENV: JSON.stringify(ENV)
      }
    }),

    // Workaround needed for angular 2 angular/angular#11580
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      root('./src') // location of your src
    ),

    // Tslint configuration for webpack 2
    new webpack.LoaderOptionsPlugin({
      options: {
        /**
         * Apply the tslint loader as pre/postLoader
         * Reference: https://github.com/wbuchwalter/tslint-loader
         */
        tslint: {
          emitErrors: false,
          failOnHint: false
        },
        /**
         * Sass
         * Reference: https://github.com/jtangelder/sass-loader
         * Transforms .scss files to .css
         */
        sassLoader: {
          //includePaths: [path.resolve(__dirname, "node_modules/foundation-sites/scss")]
        },
        /**
         * PostCSS
         * Reference: https://github.com/postcss/autoprefixer-core
         * Add vendor prefixes to your css
         */
        postcss: [
          autoprefixer({
            browsers: ['last 2 version']
          })
        ]
      }
    })
  ];

  if (!isTest && !isTestWatch) {
    config.plugins.push(
      // Generate common chunks if necessary
      // Reference: https://webpack.github.io/docs/code-splitting.html
      // Reference: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
      new CommonsChunkPlugin({
        name: ['vendor', 'polyfills']
      })
    );
  }

  // Add build specific plugins
  if (isProd) {
    config.plugins.push(
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      new webpack.NoErrorsPlugin(),

      // // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      // // Dedupe modules in the output
      // new webpack.optimize.DedupePlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin({sourceMap: true, mangle: { keep_fnames: true }})
    );
  }

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    historyApiFallback: true,
    quiet: true,
    stats: 'minimal' // none (or false), errors-only, minimal, normal (or true) and verbose
  };

  return config;
}();

// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
