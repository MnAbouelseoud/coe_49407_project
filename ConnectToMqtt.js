var wsbroker = "localhost"; //mqtt websocket enabled broker
var wsport = 3000 // port for above
var client = new Paho.MQTT.Client(wsbroker, wsport,
"myclientid_" + parseInt(Math.random() * 100, 10));
client.onConnectionLost = function (responseObject) {
console.log("connection lost: " + responseObject.errorMessage);
};
client.onMessageArrived = function (message) {
console.log(message.destinationName, ' -- ', message.payloadString);



switch(message.payloadString) {

    case '1':
        Give_One_Star ();
        break;
    case '2':
        Give_Two_Stars ();
        break;
    case '3':
        Give_Three_Stars ();
        break;
    case '4':
        Give_Four_Stars ();
        break;
    case '5':
        Give_Five_Stars ();
        break;
    default:
}


};

var options = {
timeout: 3,
onSuccess: function () {
console.log("mqtt connected");

// Connection succeeded; subscribing to the user rating topic
client.subscribe('UserRating', {qos: 1});

},
onFailure: function (message) {
console.log("Connection failed: " + message.errorMessage);
}
};
function init() {
client.connect(options);
}