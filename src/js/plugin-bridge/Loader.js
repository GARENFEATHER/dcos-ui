let pluginsList;
let externalPluginsList;

// Try loading the list of plugins.
try {
  pluginsList = require("#PLUGINS/index.js");
} catch (err) {
  // No plugins
  pluginsList = {};
}

// Try loading the list of plugins.
try {
  externalPluginsList = require("#EXTERNAL_PLUGINS/index.js");
} catch (err) {
  externalPluginsList = {};
}

// Return all available plugins
function getAvailablePlugins() {
  return {
    pluginsList,
    externalPluginsList
  };
}

/**
 * Removes a part of a filepath
 * @param  {Array} dirs    - Array of directories representing the path to a file
 * @param  {Int} atIndex - Index of directory to remove
 * @return {String}         - New path to file
 */
function removeDir(dirs, atIndex) {
  dirs.splice(atIndex, 1);

  return dirs.join("/");
}

/**
 * Finds component within subdirectories of components/
 * @param  {String} path - Path to module
 * @return {module}      - result of require
 */
function pluckComponent(path) {
  const dirs = path.split("/");
  switch (dirs[1]) {
    case "charts":
      return require("../components/charts/" + removeDir(dirs, 1));
    case "icons":
      return require("../components/icons/" + removeDir(dirs, 1));
    case "modals":
      return require("../components/modals/" + removeDir(dirs, 1));
    case "form":
      return require("../components/form/" + removeDir(dirs, 1));
    default:
      return require("../components/" + path);
  }
}

/**
 * Dynamic require of module with base directory and name
 * @param  {String} dir  - base directory of module
 * @param  {String} name - name of module
 * @return {module}      - result of require
 */
function requireModule(dir, name) {
  switch (dir) {
    case "config":
      return require("../config/" + name);
    case "constants":
      return require("../constants/" + name);
    case "events":
      return require("../events/" + name);
    case "systemPages":
      return require("../pages/system/" + name);
    case "stores":
      return require("../stores/" + name);
    case "structs":
      return require("../structs/" + name);
    case "utils":
      return require("../utils/" + name);
    case "mixins":
      return require("../mixins/" + name);
    case "components":
      return pluckComponent(name);
    case "externalPlugin":
      return require("#EXTERNAL_PLUGINS/" + name + ".js");
    case "internalPlugin":
      return require("#PLUGINS/" + name + ".js");
    default:
      throw Error(`No loader for directory: ${dir}`);
  }
}

module.exports = {
  getAvailablePlugins,
  requireModule
};
