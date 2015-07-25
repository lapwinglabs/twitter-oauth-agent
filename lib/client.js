/**
 * Module Dependencies
 */

var querystring = require('querystring');
var assign = require('object-assign');
var open = require('oauth-open');
var assert = require('assert');
var isArray = Array.isArray;

/**
 * Export `Twitter`
 */

module.exports = Twitter;

/**
 * Base endpoint
 */

var endpoint = 'https://api.twitter.com/oauth/authenticate';

/**
 * Default options
 */

var defaults = {
  redirect_uri:  window.location.origin || window.location.protocol + '//' + window.location.host,
  display: 'popup'
};

/**
 * Twitter provider
 */

function Twitter(obj, fn) {
  obj = assign(defaults, obj);
  assert(obj.oauth_token, 'Twitter authentication requires an "oauth_token" from the server');
  assert(obj.oauth_token_secret, 'Twitter authentication requires an "oauth_token_secret" from the server');
  assert(obj.oauth_callback_confirmed, 'Twitter authentication requires an "oauth_callback_confirmed" from the server');

  var url = endpoint + '?' + querystring.stringify(obj);
  open(url, function(err, data) {
    if (err) return fn(err);
    return fn(null, data);
  })
}
