const net = require('net')
const EventEmitter = require('events')
const util = require('util')

var ThinkGearClient = function(opts) {
	opts || (opts = {});

	this.port = opts.port || 13854;
	this.host = opts.host || "127.0.0.1";

  var enableRawOutput = !!opts.enableRawOutput;

	this.config = {
		enableRawOutput: enableRawOutput,
		format: "Json"
	};

	EventEmitter.call(this);
};

util.inherits(ThinkGearClient, EventEmitter);

const getProp = (obj = {}, prop) => prop.split('.').reduce((o, p) => o == null ? o : o[p], obj);

const meditationMapper = data => getProp(data, 'eSense.meditation');
const attentionMapper = data => getProp(data, 'eSense.attention');
const blinkMapper = data => {
	const value = getProp(data, 'blinkStrength');
	if (value != null) return Math.floor(value / 2);
};
const signalMapper = data => {
	const value = getProp(data, 'poorSignalLevel')
	if (value != null) return Math.floor(value / -2) + 100;
};
//const statusMapper = data => getProp(data, 'status');

ThinkGearClient.prototype.connect = function() {
	const self = this;

	const emitBuilder = (name, dataMapper, useDelta = true) => {
		if (useDelta) this[name] = 0;

		return data => {
			const value = dataMapper(data);
			
			if (value == null) return;
			
			if (useDelta) {
				const delta = value - this[name];
				this[name] = value;

				this.emit(name, { value, delta });
				console.log(`event: ${name}, value: ${value}, delta: ${delta}`);
			} else {
				this.emit(name, { value });
				console.log(`event: ${name}, value: ${value}`);
			}
		}
	}

	const emitMeditation = emitBuilder('meditation', meditationMapper);
	const emitAttention = emitBuilder('attention', attentionMapper);
	const emitBlink = emitBuilder('blink', blinkMapper);
	const emitSignal = emitBuilder('signal', signalMapper, false);
	//const emitStatus = emitBuilder('status', statusMapper, false);  // idle, scanning, notscanning

	const emitAll = data => {
		emitMeditation(data);
		emitAttention(data);
		emitBlink(data);
		emitSignal(data);
		//emitStatus(data);
	};

	var client = this.client = net.connect(this.port, this.host, function() {
		client.write(JSON.stringify(self.config));
	});

	client.on('error', function(error) {
		console.log('error');
		self.emit('error', error);
	});

	client.on('data',function(data){
		try {
			const json = JSON.parse(data.toString());
			emitAll(json);
		} catch(e) {
			console.log('parse_error');
			self.emit('parse_error', data.toString());
			console.log(data.toString());
		}
	});
};

exports.ThinkGearClient = ThinkGearClient;

exports.createClient = function(opts) {
	return new ThinkGearClient(opts || {});
};