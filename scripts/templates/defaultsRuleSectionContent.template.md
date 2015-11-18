## Defaults

```json
{
    "plugins": [
        "angular/angular"
    ],
    "rules": {<% _.each(rules, function (rule, index, rules) { %>
        "angular/<%= rule.ruleName %>": <%
        if (rule.defaultParam) {%>[<% }
        %><%= rule.defaultState %><%
        if (rule.defaultParam) {%>, <%= rule.defaultParam %>]<% }
        if (index !== rules.length -1) {%>,<% }
        }) %>
    }
}
```

----
