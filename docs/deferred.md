# deferred

When you want to create a new promise, you should not use the $q.deferred anymore.
Prefer the new syntax : $q(function(resolve, reject){})
