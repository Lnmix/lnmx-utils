/**
 * A loader designed to load fixtures for multiple databases
 *
 * Usage:
 * 1. Create a function capable of loading a jsObject for your model
 *      var func = function(jsobject, callback);
 *
 * 2. Register your loader with the FixtureLoader
 *      Fixtures.registerLoader('MyObject', func);
 *
 * 3. Load your fixtures by passing them to load directly, or by
 *    creating a file with your fixtures in it.
 *  Loader.load('./fixtures.js');
 *
 * Example file:
 * // fixtures.js
 * module.exports.MyObject = { 1: {prop: 'Dog'} }
 */
    

var fs = require('fs'),
    log = require('lnmx-log');
var loaders = {};

/**
 * Registers a function that is capable of loading fixture of a specified key
 *
 * @param {String} key The identifier that the registered loader is capable of
 *      loading fixtures for.
 * @param {Function} loader The function to be called when a fixture of key is loaded
 */
function registerLoader(key, loader) {
    loaders[key] = loader;
}

/**
 * Loads data, or a file using the registered loaders
 *
 * @param {Mixed} data Data to be loaded, either a object, or fs path
 */
function load(data) {
    if (typeof data == 'object') {
        loadObject(data);
    } else if (typeof data == 'string') {
        if (data.substr(0, 1) !== '/') {
            var parentPath = module.parent.filename.split('/');
            parentPath.pop();
            data = parentPath.join('/') + '/' + data;
        }
        var stats = fs.statSync(data);
        if (stats.isDirectory()) {
            loadDir(data);
        } else {
            loadFile(data);
        }
    }
}

/**
 * Loads a collection of objects.
 *
 * @param {Object} The objects to be loaded format
 * { MyObject: { MyObject1: {}, MyObject2: {} }, OtherObject: {} }
 */
function loadObject(data) {
    for (var key in data) {
        var objects = data[key];
        var loader = loaders[key];
        for (var i in objects) {
            var res = loader(objects[i], function(err) {
                if(err) log.info(err);
            })
        }
    }
}

/**
 * Loads an entire directory of fixture files
 *
 * @param {String} dir The filesystem path containing the fixtures.
 */
function loadDir(dir) {
    if (dir.substr(0, 1) !== '/') {
        var parentPath = module.parent.filename.split('/');
        parentPath.pop();
        dir = parentPath.join('/') + '/' + dir;
    }
    fs.readdirsync(dir).forEach(function(file) {
        loadFile(file);
    });
}

/**
 * Loads fixtures from a file
 *
 * @param {String} file The filesystem path containing the fixtures.
 */
function loadFile(file) {
    if (file.substr(0, 1) !== '/') {
        var parentPath = module.parent.filename.split('/');
        parentPath.pop();
        file = parentPath.join('/') + '/' + file;
    }

    load(require(file));
}

module.exports = {
    registerLoader: registerLoader,
    load: load
};