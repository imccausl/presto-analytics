const MAIN_SCOPES = {
  currentUser: ['currentUser'],
  types: ['types']
};

function makeScopes(scopeArray) {
  const allScopes = [];

  scopeArray.forEach(scope => {
    const scopeObj = {};

    scopeObj.method = scope.slice(0);
    scopeObj.method.push(...scope.slice(1));

    allScopes.push(scopeObj);
  });

  return allScopes;
}

module.exports = function scope(Model) {
  return (userId, types, optionalScopes = []) => {
    const allScopes = optionalScopes;
    const currentUserScope = MAIN_SCOPES.currentUser;
    const typesScope = MAIN_SCOPES.types;

    typesScope.push(types);
    currentUserScope.push(userId);

    allScopes.push(typesScope, currentUserScope);

    const scopeConfig = makeScopes(allScopes);

    return Model.scope(scopeConfig);
  };
};
