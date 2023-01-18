/**
 * @param {import('preact-cli').Config} config - Original webpack config
 * @param {import('preact-cli').Env} env - Current environment info
 * @param {import('preact-cli').Helpers} helpers - Object with useful helpers for working with the webpack config
 */
 export default (config, env, helpers) => {
  const { plugin } = helpers.getPluginsByName(config, 'DefinePlugin')[0];
  const configuredUrl = process.env.API_URL || 'http://localhost:3000/pilots';
  config.output.publicPath = process.env.BASE_PATH || '/';
  plugin.definitions['process.env.API_URL'] = JSON.stringify(configuredUrl);
}
