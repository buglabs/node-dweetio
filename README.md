# node-dweetio

A node.js module for interacting with http://dweet.io — a free, easy-to-use messaging platform for the Internet of Things.

### Installation

via npm:
```bash
$ npm install node-dweetio --save
```

### Use It

```js
var dweetClient = require("node-dweetio");
var dweetio = new dweetClient();
```

### Dweeting

Send a dweet and let dweet.io make up a name for you. Subsequent calls to this will result in the same name being used.
```js
dweetio.dweet({some:"data"}, function(err, dweet){

    console.log(dweet.thing); // The generated name
    console.log(dweet.content); // The content of the dweet
    console.log(dweet.created); // The create date of the dweet

});
```

Send a dweet with a name you define.
```js
dweetio.dweet_for("my-thing", {some:"data"}, function(err, dweet){

    console.log(dweet.thing); // "my-thing"
    console.log(dweet.content); // The content of the dweet
    console.log(dweet.created); // The create date of the dweet

});
```

### Getting Dweets

Get the latest dweet.
```js
dweetio.get_latest_dweet_for("my-thing", function(err, dweet){

    var dweet = dweet[0]; // Dweet is always an array of 1

    console.log(dweet.thing); // The generated name
    console.log(dweet.content); // The content of the dweet
    console.log(dweet.created); // The create date of the dweet

});
```

Get all dweets (up to 500 in the last 24 hours).
```js
dweetio.get_all_dweets_for("my-thing", function(err, dweets){

    // Dweets is an array of dweets
    for(theDweet in dweets)
    {
        var dweet = dweets[theDweet];

        console.log(dweet.thing); // The generated name
        console.log(dweet.content); // The content of the dweet
        console.log(dweet.created); // The create date of the dweet
    }

});
```

### Alerts

Set an alert.
```js
                              // Email addresses can also be an array
dweetio.set_alert("my-thing", "email1@doh-main.com,email2@doh-main.com", "if(dweet.some_data > 100) return 'something wrong';", "my-key", function(err){

    // If there was a problem, err will be returned, otherwise setting the alert was successful.

});
```

Get an alert
```js
dweetio.get_alert("my-thing", "my-key", function(err, alertData){

    // If there was a problem, err will be returned, otherwise the data for the alert will be returned in alertData

});
```

Remove an alert
```js
// Email addresses can also be an array
dweetio.remove_alert("my-thing", "my-key", function(err){

    // If there was a problem, err will be returned, otherwise the alert will have been successfully removed.

});
```

### Pubsub

Listen for all dweets from a thing.
```js
dweetio.listen_for("my-thing", function(dweet){

    // This will be called anytime there is a new dweet for my-thing

});
```

Stop listening for dweets from a thing.
```js
dweetio.stop_listening_for("my-thing");
```

Stop listening for dweets from everything.
```js
dweetio.stop_listening();
```

### Locking & Security

By default, all things are publicly accessible if you know the name of the thing. You can also lock things so that they are only accessible to users with valid security credentials. To purchase locks, visit https://dweet.io/locks. The locks will be emailed to you.

To use purchased locks:

```js
// To lock a thing
dweetio.lock("my-thing", "my-lock", "my-key", function(err){

    // If there was a problem, err will be returned, otherwise the lock was successful.

});

// To unlock a thing
dweetio.unlock("my-thing", "my-key", function(err){

    // If there was a problem, err will be returned, otherwise the lock was successful.

});

// To remove a lock no matter what it's attached to
dweetio.remove_lock("my-lock", "my-key", function(err){

    // If there was a problem, err will be returned, otherwise the lock was successful.

});
```

Once a thing has been locked, you must pass the key to the lock with any call you make to other functions in this client library. The key will be passed as a parameter before the callback function. For example:

```js
dweetio.dweet_for("my-locked-thing", {some:"data"}, "my-key", callback);

dweetio.get_latest_dweet_for("my-locked-thing", "my-key", callback);

dweetio.get_all_dweets_for("my-locked-thing", "my-key", callback);

dweetio.listen_for("my-locked-thing", "my-key", callback);
```

Failure to pass a key or passing an incorrect key for a locked thing will result in an error being returned in the callback.

### Copyright & License

Copyright © 2013 Jim Heising (https://github.com/jheising)
<br/>
Copyright © 2013 Bug Labs, Inc. (http://buglabs.net)
<br/>
Licensed under the **MIT** license.

