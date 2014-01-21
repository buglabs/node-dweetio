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

Dweet something:
```js
// Send a dweet and let dweet.io make up a name for you. Subsequent calls to this will result in the same name being used.
dweetio.dweet({some:"data"}, function(err, dweet){

    console.log(dweet.thing); // The generated name
    console.log(dweet.content); // The content of the dweet
    console.log(dweet.created); // The create date of the dweet

});

// Send a dweet with a name you define
dweetio.dweet_for("my-thing", {some:"data"}, function(err, dweet){

    console.log(dweet.thing); // "my-thing"
    console.log(dweet.content); // The content of the dweet
    console.log(dweet.created); // The create date of the dweet

});

```





### Copyright & License

Copyright © 2013 Jim Heising (https://github.com/jheising)
<br/>
Copyright © 2013 Bug Labs, Inc. (http://buglabs.net)
<br/>
Licensed under the **MIT** license.

