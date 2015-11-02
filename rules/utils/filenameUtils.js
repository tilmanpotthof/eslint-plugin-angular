'use strict';

var defaultFileEnding = '.js';

var componentTypeMappings = {
    module: 'module',
    controller: 'controller',
    directive: 'directive',
    filter: 'filter',
    service: 'service',
    factory: 'service',
    provider: 'service',
    value: 'service',
    constant: 'constant'
};

var separators = {
    dot: '.',
    dash: '-',
    underscore: '_'
};

module.exports = {
    componentTypeMappings: componentTypeMappings,
    createExpectedName: createExpectedName
};

function createExpectedName(name, type, options) {
    var typeSeparator = separators[options.typeSeparator];

    if (options.ignoreTypeSuffix) {
        name = _removeTypeSuffix(name, type);
    }
    if (options.ignorePrefix && options.ignorePrefix.length > 0) {
        name = _removePrefix(name, options);
    }
    if (options.nameStyle) {
        name = _transformComponentName(name, options);
    }
    if (typeSeparator !== undefined) {
        name = name + typeSeparator + type;
    }
    return name + defaultFileEnding;
}

function _firstToUpper(value) {
    return value[0].toUpperCase() + value.slice(1);
}

function _firstToLower(value) {
    return value[0].toLowerCase() + value.slice(1);
}

function _removeTypeSuffix(name, type) {
    var nameTypeLengthDiff = name.length - type.length;
    if (nameTypeLengthDiff <= 0) {
        return name;
    }
    var typeCamelCase = _firstToUpper(type);
    if (name.indexOf(typeCamelCase) === nameTypeLengthDiff) {
        return name.slice(0, nameTypeLengthDiff);
    }
    return name;
}

function _removePrefix(name, options) {
    if (new RegExp('^' + options.ignorePrefix + '[A-Z]').test(name)) {
        return _firstToLower(name.slice(options.ignorePrefix.length));
    }
    return name;
}

function _transformComponentName(name, options) {
    var nameStyle = options.nameStyle;
    var nameSeparator = separators[nameStyle];
    if (nameSeparator) {
        var replacement = '$1' + nameSeparator + '$2';
        name = name.replace(/([a-z])([A-Z])/g, replacement).toLowerCase();
    }
    return name;
}
