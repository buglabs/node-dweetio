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

### Notifications

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

### Copyright & License

Copyright © 2013 Jim Heising (https://github.com/jheising)
<br/>
Copyright © 2013 Bug Labs, Inc. (http://buglabs.net)
<br/>
Licensed under the **MIT** license.

