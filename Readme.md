
# twitter-oauth-agent

  Bare bones, low-level agent for authenticating with Twitter's oAuth.

  Uses both a client-side and server-side library to make the oAuth handshake more understandable.

  This library does not make any assumptions about your server-side architecture, allowing it to easily adapt to any setup.

## Example

**Part 1: server.js**

```js
var Twitter = require('twitter-oauth-agent');

// Get the token and send to the client
Twitter({
  consumer_key: options.consumer_key,
  consumer_secret: options.consumer_secret,
  callback: query.callback || options.callback
}, function(err, token) {
  if (err) return res.status(500).send({ error: err.message });
  res.send(token);
})
```

**Part 2: client.js**

```js
var Twitter = require('twitter-oauth-agent');

// Open popup with the token object sent from the server
Twitter(token, function(err, code) {
  // send "code" to server.js
})
```

**Part 3: server.js**

```js
var Twitter = require('twitter-oauth-agent');

// received "code" from client, use it to
// fetch the full profile.
Twitter({
  consumer_secret: options.consumer_secret,
  oauth_verifier: body.oauth_verifier,
  consumer_key: options.consumer_key,
  oauth_token: body.oauth_token
}, function(err, profile) {
  // "profile" will contain your twitter information
});

```

## Installation

```
npm install twitter-oauth-agent
```

## Getting the keys

<img src="http://indonesia-royal.com/wp-content/uploads/2014/06/twitter-bird-square-logo.jpg" height="70">
- Sign in at [https://apps.twitter.com](https://apps.twitter.com/)
- Click on **Create New App**
- Enter your *Application Name*, *Description* and *Website*
- For **Callback URL**: *http://127.0.0.1:3000*
- Go to **Settings** tab
- Under *Application Type* select **Read and Write** access
- Check the box **Allow this application to be used to Sign in with Twitter**
- Click **Update this Twitter's applications settings**

## See also:

- [google-oauth-agent](https://github.com/lapwinglabs/google-oauth-agent)
- [facebook-oauth-agent](https://github.com/lapwinglabs/facebook-oauth-agent)
- [linkedin-oauth-agent](https://github.com/lapwinglabs/linkedin-oauth-agent)

## Credits

Most of this code is distilled from the [satellizer](https://github.com/sahat/satellizer) project.

## License

(The MIT License)

Copyright (c) 2015 Matthew Mueller &lt;matt@lapwinglabs.com&gt;
