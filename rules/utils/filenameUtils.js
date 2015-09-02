(function () {
    'use strict';

    var defaultFileEnding = '.js';

    var filenameUtils = {
        separators: {
            dot: '.',
            dash: '-',
            underscore: '_'
        },
        componentTypeMappings: {
            module: 'module',
            controller: 'controller',
            directive: 'directive',
            filter: 'filter',
            service: 'service',
            factory: 'service',
            provider: 'service',
            value: 'service',
            constant: 'constant'
        },
        firstToUpper: function (value) {
            return value[0].toUpperCase() + value.slice(1);
        },
        firstToLower: function (value) {
            return value[0].toLowerCase() + value.slice(1);
        },
        removeTypeSuffix: function (name, type) {
            var nameTypeLengthDiff = name.length - type.length;
            if (nameTypeLengthDiff <= 0) {
                return name;
            }
            var typeCamelCase = this.firstToUpper(type);
            if (name.indexOf(typeCamelCase) === nameTypeLengthDiff) {
                return name.slice(0, nameTypeLengthDiff);
            } else {
                return name;
            }
        },
        removePrefix: function (name, options) {
            if (new RegExp('^' + options.ignorePrefix + '[A-Z]').test(name)) {
                return this.firstToLower(name.slice(options.ignorePrefix.length));
            } else {
                return name;
            }
        },
        transformComponentName: function (name, options) {
            var nameStyle = options.nameStyle;
            var nameSeparator = filenameUtils.separators[nameStyle];
            if (nameSeparator) {
                var replacement = "$1" + nameSeparator + "$2";
                name = name.replace(/([a-z])([A-Z])/g, replacement).toLowerCase();
            }
            return name;
        },
        createExpectedName: function (name, type, options) {
            var typeSeparator = filenameUtils.separators[options.typeSeparator];

            if (options.ignoreTypeSuffix) {
                name = filenameUtils.removeTypeSuffix(name, type);
            }
            if (options.ignorePrefix && options.ignorePrefix.length > 0) {
                name = filenameUtils.removePrefix(name, options);
            }
            if (options.nameStyle) {
                name = filenameUtils.transformComponentName(name, options);
            }
            if (typeSeparator !== undefined) {
                name = name + typeSeparator + type;
            }
            return name + defaultFileEnding;

        }
    };

    module.exports = filenameUtils;
}());
