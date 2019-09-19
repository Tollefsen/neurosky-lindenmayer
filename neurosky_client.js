// global vars to store current data points
var neurosky = {
    connectedNeurosky: false,
    attention: 0,
    meditation: 0,
    blink: 0,
    poorSignalLevel: 0,
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
      // parse the data (sent as string) into a standard JSON object (much easier to use)
      var data = JSON.parse(evt.data);
      // handle "eSense" data
      if (data.eSense) {
        neurosky.attention = data.eSense.attention;
        neurosky.meditation = data.eSense.meditation;
      }
  
      // handle "blinkStrength" data
      if (data.blinkStrength) {
        neurosky.blink = data.blinkStrength;
        //console.log('[blink] ' + neurosky.blink);
      }
  
      // handle "poorSignal" data
      if (data.poorSignalLevel != null) {
        neurosky.poorSignalLevel = parseInt(data.poorSignalLevel);
      }
      //  console.log('A', neurosky.attention, 'M', neurosky.meditation);
    };
  
    // when websocket closes connection, do this stuff
    ws.onclose = function() {
      // websocket is closed.
      console.log('WebSocket connection is closed...');
      neurosky.connectedNeurosky = false;
    };
  }