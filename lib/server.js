/**
 * Module dependencies
 */

var querystring = require('querystring');
var request = require('request');
var assign = require('object-assign');
var assert = require('assert');

/**
 * Export `Twitter`
 */

module.exports = Twitter;

/**
 * Request Token Endpoint
 */

var request_token_endpoint = 'https://api.twitter.com/oauth/request_token';

/**
 * Access Token Endpoint
 */

var access_token_endpoint = 'https://api.twitter.com/oauth/access_token';

/**
 * API Endpoint
 */

var api_endpoint = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

/**
 * Initialize `Twitter`
 */

function Twitter(obj, fn) {
  return !obj.oauth_token || !obj.oauth_verifier
    ? request_oauth_token(obj, fn)
    : exchange_oauth_token(obj, fn);
}

/**
 * Part 1: Request the oauth token
 */

function request_oauth_token(obj, fn) {
  assert(obj.consumer_key, 'Twitter authentication requires "consumer_key"');
  assert(obj.consumer_secret, 'Twitter authentication requires "consumer_secret"');
  assert(obj.callback, 'Twitter authentication requires "callback"');

  var obj = {
    consumer_key: obj.consumer_key,
    consumer_secret: obj.consumer_secret,
    callback: obj.callback
  };

  request.post({ url: request_token_endpoint, oauth: obj }, function(err, response, body) {
    if (err) return fn(err);
    var token = querystring.parse(body);
    fn(null, token);
  });
}

/**
 * Part 2: Exchange the token for an access token and request profile
 */

function exchange_oauth_token(obj, fn) {
  assert(obj.consumer_key, 'Twitter authentication requires "consumer_key"');
  assert(obj.consumer_secret, 'Twitter authentication requires "consumer_secret"');
  assert(obj.oauth_token, 'Twitter authentication requires "oauth_token"');
  assert(obj.oauth_verifier, 'Twitter authentication requires "oauth_verifier"');

  var consumer_key = obj.consumer_key;
  var consumer_secret = obj.consumer_secret;

  var obj = {
    consumer_key: consumer_key,
    consumer_secret: consumer_secret,
    verifier: obj.oauth_verifier,
    token: obj.oauth_token
  };

  request.post({ url: access_token_endpoint, oauth: obj }, function(err, response, body) {
    if (response.statusCode != 200) return fn(new Error(body));
    var token = querystring.parse(body);

    var obj = {
      consumer_key: consumer_key,
      consumer_secret: consumer_secret,
      oauth_token: token.oauth_token
    };

    request.get({
      url: api_endpoint + token.screen_name,
      oauth: obj,
      json: true
    }, function(err, response, body) {
      if (body.errors) {
        var err = new Error(body.errors.map(function(error) { return error.message; }).join('. '));
        return fn(err);
      }

      return fn(null, assign(res.body, {
        access_token: token.oauth_token,
        access_token_secret: token.oauth_token_secret
      }));
    });
  });
}
