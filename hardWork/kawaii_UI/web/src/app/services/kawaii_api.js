app.factory('Kawaii_Parse', function($resource) {
  return $resource(api_endpoint_v2 + '/kawaii/parse?q=:query&model=:model', {query:'@id', model: '@id'});
});

app.factory('Kawaii_Status', function($resource) {
  return $resource(api_endpoint_v2 + '/kawaii/status');
});

app.factory('Kawaii_Config', function($resource) {
  return $resource(api_endpoint_v2 + '/kawaii/config');
});

app.factory('Kawaii_Version', function($resource) {
  return $resource(api_endpoint_v2 + '/kawaii/version');
});

/* TODO: future feature
app.factory('Set_Kawaii_Config', function($resource) {
  return $resource(kawaii_api_endpoint + '/setconfig?:key=:value', {key: '@id', value: '@id'});
});
*/
