var io = require("socket.io-client");
var request = require("request");
var fs = require("fs");

var cookies = request.jar();
var COOKIE_FILE = "cookies.txt";
var DWEET_SERVER = "http://dweet.io";

if(fs.existsSync(COOKIE_FILE))
{
    try
    {
        var cookieString = fs.readFileSync(COOKIE_FILE).toString();
        cookies._jar.setCookieSync(cookieString, DWEET_SERVER);
    }
    catch(e){}
}

var dweetio = function()
{
	var self = this;
	var socket;
	var listenCallbacks = {};

	function normalizeDweet(dweet)
	{
		if(dweet.created)
		{
			dweet.created = new Date(dweet.created);
		}

		return dweet;
	}

	function normalizeDweets(dweets)
	{
        cookies._jar.getCookies(DWEET_SERVER, function(err,cookies) {
            try
            {
                fs.writeFile(COOKIE_FILE, cookies.join("; "));
            }
            catch(e){}
        });

		if(dweets instanceof Array)
		{
			for(var index = 0; index < dweets.length; index++)
			{
				var dweet = dweets[index];
				normalizeDweet(dweet);
			}
		}
		else
		{
			normalizeDweet(dweets);
		}

		return dweets;
	}

	function processError(responseData)
	{
		var err;

		if(responseData && responseData["this"] == "failed")
		{
			err = new Error(responseData["because"]);
		}

		return err;
	}

	self.set_server = function(server)
	{
		DWEET_SERVER = server;
	}

	self.dweet = function(data, callback)
	{
		if(self.current_thing)
		{
			self.dweet_for(self.current_thing, data, callback);
		}
		else
		{
			request({
				url   : DWEET_SERVER + "/dweet",
				jar : cookies,
				method: "POST",
				json  : data
			}, function(err, response, responseData)
			{
				if(!err)
				{
					err = processError(responseData);
				}

				callback(err, normalizeDweets(responseData["with"]));
			});
		}
	};

	self.dweet_for = function(thing, data, callback)
	{
		request({
			url   : DWEET_SERVER + "/dweet/for/" + thing,
			jar : cookies,
			method: "POST",
			json  : data
		}, function(err, response, responseData)
		{
			if(!err)
			{
				err = processError(responseData);
			}

			callback(err, normalizeDweets(responseData["with"]));
		});
	}

	self.get_latest_dweet_for = function(thing, callback)
	{
		request({
			url   : DWEET_SERVER + "/get/latest/dweet/for/" + thing,
			jar   : cookies,
			json  : {}
		}, function(err, response, responseData)
		{
			if(!err)
			{
				err = processError(responseData);
			}

			callback(err, normalizeDweets(responseData["with"]));
		});
	}

	self.get_all_dweets_for = function(thing, callback)
	{
		request({
			url : DWEET_SERVER + "/get/dweets/for/" + thing,
			jar : cookies,
			json: {}
		}, function(err, response, responseData)
		{
			if(!err)
			{
				err = processError(responseData);
			}

			callback(err, normalizeDweets(responseData["with"]));
		});
	}

	self.listen_for = function(thing, callback)
	{
		// Initialize our callback list
		if(!listenCallbacks[thing])
		{
			listenCallbacks[thing] = [];
		}

		// Add this to our callbacks
		if(listenCallbacks[thing].indexOf(callback) == -1)
		{
			listenCallbacks[thing].push(callback);
		}

		if(!socket)
		{
			socket = io.connect(DWEET_SERVER + "/stream");

			socket.on("connect", function()
			{
				// Subscribe to all of the things that we might have asked for before connecting
				for(var id in listenCallbacks)
				{
					socket.emit("subscribe", {thing: id});
				}
			});

			socket.on("new_dweet", function(msg)
			{
				if(listenCallbacks[msg.thing])
				{
					normalizeDweets(msg);

					var callbacks = listenCallbacks[msg.thing];
					for(var index = 0; index < callbacks.length; index++)
					{
						callbacks[index](msg);
					}
				}
			});
		}
		else if(socket && socket.socket.connected)
		{
			socket.emit("subscribe", {thing: thing});
		}
	}

	self.stop_listening = function()
	{
		listenCallbacks = {};

		if(socket)
		{
			socket.disconnect();
			socket = undefined;
		}
	}

	self.stop_listening_for = function(thing)
	{
		listenCallbacks[thing] = undefined;
		delete listenCallbacks[thing];

		if(socket)
		{
			socket.emit("unsubscribe", {thing: thing});
		}
	}
};

module.exports = dweetio;