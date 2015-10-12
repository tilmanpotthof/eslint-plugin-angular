'use strict';

var fs = require('fs');
var eslintAngularIndex = require('../../index.js');
var testUtils = require('../../test/utils/testUtils.js');


var readmeContent = fs.readFileSync('README.md').toString();

var ruleFiles = testUtils.getFiles({
    basePath: './rules/',
    ignoreFiles: ['index.js', 'utils']
});

var ruleNames = Object.keys(eslintAngularIndex.rules).filter(function(ruleName) {
    // filter legacy rules
    return !/^ng_/.test(ruleName);
});

var documentedRules = [];

readmeContent.split('\n').forEach(function (readmeContentLine) {
    var match = /^\|\s*([\w|-]+)\s*\|\s*(.*)\s*\|$/g.exec(readmeContentLine);
    if (match) {
        var ruleName = match[1];
        var description = match[2]
        if (ruleName !== 'Name' && ruleName !== '-------------') {
            documentedRules.push({
                ruleName: ruleName,
                description: description
            });
        }
    }
});

console.log('ruleNames.length', ruleNames.length);
console.log('documentedRules.length', documentedRules.length);

documentedRules.forEach(function (rule) {
    var ruleSourcePath = 'rules/' + rule.ruleName + '.js';
    var descriptionLines = rule.description.trim().split(/\.\s+/g);
    var formattedDescriptions = descriptionLines.join('.\n');
    var content = '# ' + rule.ruleName + '\n\n' + formattedDescriptions;
    fs.writeFileSync('docs/' + rule.ruleName + '.md', content);

    var ruleSourceContent = fs.readFileSync(ruleSourcePath).toString();
    var ruleDocumentationComment =
        '/**\n' +
        ' * ' + descriptionLines.join('.\n * ') + '\n' +
        ' */\n';
    var ruleSourceCotentWithDocumentation = ruleDocumentationComment + ruleSourceContent;
    fs.writeFileSync(ruleSourcePath, ruleSourceCotentWithDocumentation);
});

