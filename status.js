var http = require("http");
var ws = require("nodejs-websocket");
var fs = require("fs");
var web3 = require('web3');
var BigNumber = require('bignumber.js');    

var eth = web3.eth;
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

http.createServer(function (req, res) {
	fs.createReadStream("index.html").pipe(res)
}).listen(8082)

var server = ws.createServer(function (connection) {
	connection.nickname = null
	connection.on("text", function (str) {
		if (connection.nickname === null) {
			connection.nickname = str
			broadcast(str+" entered")
		} else
			broadcast("["+connection.nickname+"] "+str)
	})
	connection.on("close", function () {
		broadcast(connection.nickname+" left")
	})
	connection.on('error', function(e) {
		console.log('problem with connection: ' + e.message);
	})
})
server.listen(8081)

setInterval(function() {
  fs.readFile('rep', { encoding: 'ascii' },  function (err, data) {
    if (err) throw err;
//    console.log(data.toString());
    var view = data.toString();

  try {
    view += "\nCoinbase: " + eth.coinbase;
    view += "\nBalance (ETH): " + eth.getBalance(eth.coinbase).dividedBy(1000000000000000000).toString();
    view += "\nHashrate: " + eth.hashrate;
    view += "\nBlocknumber: " + web3.toDecimal(eth.blockNumber);
    view += "\nPeer Count: " + web3.net.peerCount;
  } catch(err) {}

    broadcast(view);
    });
}, 2000);

function broadcast(str) {
	server.connections.forEach(function (connection) {
		connection.sendText(str)
	});
}
