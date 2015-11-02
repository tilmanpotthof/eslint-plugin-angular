'use strict';

module.exports = (function() {
    var path = require('path');
    var utils = require('./utils/utils');
    var filenameUtils = require('./utils/filenameUtils');

    return function(context) {
        var options = context.options[0] || {};
        var filename = path.basename(context.getFilename());

        return {

            CallExpression: function(node) {
                if (utils.isAngularComponent(node) && utils.isMemberExpression(node.callee)) {
                    var name = node.arguments[0].value;
                    var type = filenameUtils.componentTypeMappings[node.callee.property.name];
                    var expectedName;

                    if (type === undefined || (type === 'service' && node.callee.object.name === '$provide')) {
                        return;
                    }

                    expectedName = filenameUtils.createExpectedName(name, type, options);

                    if (expectedName !== filename) {
                        context.report(node, 'Filename must be "{{expectedName}}"', {
                            expectedName: expectedName
                        });
                    }
                }
            }
        };
    };
}());
