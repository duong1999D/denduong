var websocket = "broker.hivemq.com";
var port = 8000;
var user = "12345678";
var pass = "12345678";

clientID = "clientID-" + parseInt(Math.random() * 100);
client = new Paho.MQTT.Client(websocket, port, clientID);

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

var options = {
  onSuccess: onConnect,
  onFailure: doFail,
};

client.connect(options);

function onConnect() {
  document.getElementById("lable_connect").innerHTML = "Connected Sever MQTT";
  document.getElementById("lable_connect").style.backgroundColor = "yellow";
  console.log("onConnect");
  client.subscribe("controlHome_pub");
  message = new Paho.MQTT.Message("status");
  message.destinationName = "controlHome_sub";
  client.send(message);
  message = new Paho.MQTT.Message("request");
  message.destinationName = "controlHome_sub";
  client.send(message);
}

function doFail(e) {
  document.getElementById("lable_connect").innerHTML = "Not Connected";
  document.getElementById("lable_connect").style.backgroundColor = "red";
  console.log("Connection Attempt to Host " + websocket + "  Failed");
  setTimeout(MQTTconnect, 2000);
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
}

function onMessageArrived(message) {
  var data_read = message.payloadString;
  xulidata(data_read);
  //document.getElementById("a").innerHTML = data_read;
  console.log("onMessageArrived:" + data_read);
}

function xulidata(data_value) {
  switch (data_value) {
    case "connected":
      document.getElementById("lable_connect").innerHTML = "Connected ESP";
      document.getElementById("lable_connect").style.color = "black";
      document.getElementById("lable_connect").style.backgroundColor =
        "lightblue";
      break;
    case "on":
      document.getElementById("state_led").style.backgroundColor = "green";
      break;
    case "off":
      document.getElementById("state_led").style.backgroundColor = "white";
      break;
    default:
      var DataJson = JSON.parse(data_value);
      if (DataJson.tb1 == "0") {
        document.getElementById("button_1").style.backgroundColor = "lightgray";
        document.getElementById("button_1").innerHTML = "OFF";
      } else if (DataJson.tb1 == "1") {
        document.getElementById("button_1").style.backgroundColor = "green";
        document.getElementById("button_1").innerHTML = "ON";
      }

      if (DataJson.tb2 == "0") {
        document.getElementById("button_2").style.backgroundColor = "lightgray";
        document.getElementById("button_2").innerHTML = "OFF";
      } else if (DataJson.tb2 == "1") {
        document.getElementById("button_2").style.backgroundColor = "green";
        document.getElementById("button_2").innerHTML = "ON";
      }

      if (DataJson.tb3 == "0") {
        document.getElementById("button_3").style.backgroundColor = "lightgray";
        document.getElementById("button_3").innerHTML = "OFF";
      } else if (DataJson.tb3 == "1") {
        document.getElementById("button_3").style.backgroundColor = "green";
        document.getElementById("button_3").innerHTML = "ON";
      }
      break;
  }
}

function kiemtra_data(button_ktra) {
  if (button_ktra == 1) {
    if (document.getElementById("button_1").innerHTML == "ON")
      write_data("1off");
    else if (document.getElementById("button_1").innerHTML == "OFF")
      write_data("1on");
  } else if (button_ktra == 2) {
    if (document.getElementById("button_2").innerHTML == "ON")
      write_data("2off");
    else if (document.getElementById("button_2").innerHTML == "OFF")
      write_data("2on");
  } else if (button_ktra == 3) {
    if (document.getElementById("button_3").innerHTML == "ON")
      write_data("3off");
    else if (document.getElementById("button_3").innerHTML == "OFF")
      write_data("3on");
  }
}

function write_data(value) {
  message = new Paho.MQTT.Message(value);
  message.destinationName = "controlHome_sub";
  client.send(message);
}
