// global vars to store current data points
var neurosky = {
    connectedNeurosky: false,
    attention: 0,
    attentionDelta: 0,
    meditation: 0,
    meditationDelta: 0,
    blink: 0,
    blinkDelta: 0,
    signal: 0
  };
  
  if ("WebSocket" in window) {
    console.log('WebSocket is supported by your Browser.');
  
    var ws = new WebSocket('ws://127.0.0.1:8080');
  
    // when WebSocket connection is opened, do this stuff
    ws.onopen = function() {
      console.log('WebSocket connection is opened');
      ws.send('Browser connected');
      neurosky.connectedNeurosky = true;
    };
  
    // whenever websocket server transmit a message, do this stuff
    ws.onmessage = function(evt) {
      const { name, value, delta } = JSON.parse(evt.data);
      neurosky[name] = value;
      if (delta) neurosky[name + "Delta"] = delta;
    };
  
    // when websocket closes connection, do this stuff
    ws.onclose = function() {
      // websocket is closed.
      console.log('WebSocket connection is closed...');
      neurosky.connectedNeurosky = false;
    };
  }