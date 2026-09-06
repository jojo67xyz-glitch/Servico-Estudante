export default function () {
  return {
    eslint: {
      warnings: true,
      errors: true
    },

    boot: [],

    css: ['app.scss'],

    extras: ['material-icons', 'fontawesome-v7'],

    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20'
      },
      vueRouterMode: 'history',
      publicPath: '/'
    },

    devServer: {
      host: '0.0.0.0',
      port: 9000,
      open: false,
      proxy: {
        '/api': 'http://localhost:3000'
      }
    },

    framework: {
      config: {},
      plugins: ['Notify', 'Dialog', 'LoadingBar']
    },

    animations: 'all',
    ssr: {},
    pwa: false,
    cordova: false,
    capacitor: false,
    electron: false
  };
}
