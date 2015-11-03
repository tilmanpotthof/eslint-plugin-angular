'use strict';

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

var chai = require('chai');
var spies = require('chai-spies');
var rules = require('../../index').rules;
var RuleTester = require('eslint').RuleTester;

chai.use(spies);

chai.spy.on(console, 'warn');
chai.spy.on(rules, 'ng_angularelement');

describe('legacy rule', function() {
    it('logs a warning once', function() {
        chai.expect(console.warn).to.have.been.called.once; // eslint-disable-line no-console
        chai.expect(rules.ng_angularelement).to.have.been.called.twice;
    });

    it('logs a deprecation warning with further information', function() {
        chai.expect(console.warn) // eslint-disable-line no-console
            .to.have.been.called.with('WARNING: Deprecated rule name ng_angularelement use angular/angularelement instead (will be removed in v1.0).');
    });
});

var eslintTester = new RuleTester();

// rule two check on a legacy rule to test the warning
eslintTester.run('ng_angularelement', rules.ng_angularelement, {
    valid: [
        'angular.element("#id")'
    ],
    invalid: [
        {code: '$( )', errors: [{message: 'You should use angular.element instead of the jQuery $ object'}]}
    ]
});


eslintTester.run('timeout-service', rules['timeout-service'], {
    valid: [{
        code: '$timeout()',
        filename: 'avanger.service.js',
        settings: {'angular/only-lint-matching-filenames': '\.service\.js$'}
    }, {
        code: 'setTimeout()',
        filename: 'noAngularFile.js',
        settings: {'angular/only-lint-matching-filenames': '\.service\.js$'}
    }],
    invalid: [{
        code: 'setTimeout()',
        filename: 'avanger.service.js',
        settings: {'angular/only-lint-matching-filenames': '\.service\.js$'},
        errors: [{message: 'You should use the $timeout service instead of the default window.setTimeout method'}]
    }, {
        code: 'setTimeout()',
        filename: 'avanger.directive.js',
        settings: {'angular/only-lint-matching-filenames': '\.(service|directive)\.js$'},
        errors: [{message: 'You should use the $timeout service instead of the default window.setTimeout method'}]
    }]
});

