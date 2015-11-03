'use strict';

var MATCHING_FILE_SETTINGS_PROPERTY = 'angular/only-lint-matching-filenames';

function Rule(name, config) {
    this.name = name;
    this.config = config;
    this._requireRule = require('../' + this.name);
}

function _wrapRuleWithSettingsCheck(rule) {
    return function(context) {
        var onlyLinkMatchingFilenames = context.settings[MATCHING_FILE_SETTINGS_PROPERTY];
        if (onlyLinkMatchingFilenames && !new RegExp(onlyLinkMatchingFilenames).test(context.getFilename())) {
            // return empty object to disabled all checks for this file
            return {};
        }
        return rule(context);
    };
}

Rule.prototype = {
    requireRule: function() {
        return function(context) {
            return this._requireRule(context);
        }.bind(this);
    },
    requireLegacyRule: function() {
        var legacyRule = function(context) {
            this.logWarningOnce(context);
            return this._requireRule(context);
        }.bind(this);

        legacyRule.schema = this._requireRule.schema;
        return legacyRule;
    },
    getLegacyName: function() {
        return 'ng_' + this.name.replace(/-/g, '_');
    },
    logWarningOnce: function(context) {
        /* eslint-disable no-console */
        console.warn('WARNING: Deprecated rule name ' + context.id + ' use angular/' + this.name + ' instead (will be removed in v1.0).');
        /* eslint-enable no-console */
        this.logWarningOnce = function() { };
    }
};

module.exports = {
    rules: [],
    addRule: function(name, config) {
        this.rules.push(new Rule(name, config));
    },
    moduleExports: function() {
        var exportObject = {
            rules: {},
            rulesConfig: {}
        };

        this.rules.forEach(function(rule) {
            var legacyName = rule.getLegacyName();

            exportObject.rules[rule.name] = _wrapRuleWithSettingsCheck(rule.requireRule());
            exportObject.rulesConfig[rule.name] = rule.config;

            exportObject.rules[legacyName] = _wrapRuleWithSettingsCheck(rule.requireLegacyRule());
            exportObject.rulesConfig[legacyName] = 0;
        });
        return exportObject;
    }
};
