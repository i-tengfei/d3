define( function( require, exports, module ) {

	var Events = require( 'D3.Events' );

	function FourierTransform( bufferSize, sampleRate ) {

		this.bufferSize = bufferSize;
		this.sampleRate = sampleRate;
		this.bandwidth  = 2 / bufferSize * sampleRate / 2;

		this.spectrum   = new Float32Array( bufferSize/2 );
		this.real       = new Float32Array( bufferSize );
		this.imag       = new Float32Array( bufferSize );

		this.peakBand   = 0;
		this.peak       = 0;


	}

	FourierTransform.prototype.getBandFrequency = function( index ){
		return this.bandwidth * index + this.bandwidth / 2;
	};

	FourierTransform.prototype.calculateSpectrum = function( ) {
		var spectrum  = this.spectrum,
		real      = this.real,
		imag      = this.imag,
		bSi       = 2 / this.bufferSize,
		sqrt      = Math.sqrt,
		rval, ival, mag;

		for (var i = 0, N = this.bufferSize/2; i < N; i++) {
			rval = real[i];
			ival = imag[i];
			mag = bSi * sqrt( rval * rval + ival * ival );

			if ( mag > this.peak ) {
				this.peakBand = i;
				this.peak = mag;
			}

			spectrum[i] = mag;
		}
	};

	function FFT( bufferSize, sampleRate ) {

		FourierTransform.call( this, bufferSize, sampleRate );

		this.reverseTable = new Uint32Array(bufferSize);

		var limit = 1;
		var bit = bufferSize >> 1;

		var i;

		while (limit < bufferSize) {
			for (i = 0; i < limit; i++) {
				this.reverseTable[i + limit] = this.reverseTable[i] + bit;
			}

			limit = limit << 1;
			bit = bit >> 1;
		}

		this.sinTable = new Float32Array(bufferSize);
		this.cosTable = new Float32Array(bufferSize);

		for (i = 0; i < bufferSize; i++) {
			this.sinTable[i] = Math.sin(-Math.PI/i);
			this.cosTable[i] = Math.cos(-Math.PI/i);
		}

	}

	FFT.prototype = Object.create( FourierTransform.prototype );

	FFT.prototype.forward = function(buffer) {

		var bufferSize	= this.bufferSize,
		cosTable        = this.cosTable,
		sinTable        = this.sinTable,
		reverseTable    = this.reverseTable,
		real            = this.real,
		imag            = this.imag,
		spectrum        = this.spectrum;

		var k = Math.floor( Math.log( bufferSize ) / Math.LN2 );

		if (Math.pow(2, k) !== bufferSize) { throw "Invalid buffer size, must be a power of 2."; }
		if (bufferSize !== buffer.length)  { throw "Supplied buffer is not the same size as defined FFT. FFT Size: " + bufferSize + " Buffer Size: " + buffer.length; }

		var halfSize = 1,
		phaseShiftStepReal,	phaseShiftStepImag,
		currentPhaseShiftReal, currentPhaseShiftImag,
		off, tr, ti, tmpReal, i;

		for (i = 0; i < bufferSize; i++) {
			real[i] = buffer[reverseTable[i]];
			imag[i] = 0;
		}

		while (halfSize < bufferSize) {
			
			phaseShiftStepReal = cosTable[halfSize];
			phaseShiftStepImag = sinTable[halfSize];

			currentPhaseShiftReal = 1;
			currentPhaseShiftImag = 0;

			for (var fftStep = 0; fftStep < halfSize; fftStep++) {
				i = fftStep;

				while (i < bufferSize) {
					off = i + halfSize;
					tr = (currentPhaseShiftReal * real[off]) - (currentPhaseShiftImag * imag[off]);
					ti = (currentPhaseShiftReal * imag[off]) + (currentPhaseShiftImag * real[off]);

					real[off] = real[i] - tr;
					imag[off] = imag[i] - ti;
					real[i] += tr;
					imag[i] += ti;

					i += halfSize << 1;
				}

				tmpReal = currentPhaseShiftReal;
				currentPhaseShiftReal = (tmpReal * phaseShiftStepReal) - (currentPhaseShiftImag * phaseShiftStepImag);
				currentPhaseShiftImag = (tmpReal * phaseShiftStepImag) + (currentPhaseShiftImag * phaseShiftStepReal);
			}

			halfSize = halfSize << 1;
		}

		return this.calculateSpectrum( );
	};

	function Dancer( src ){

		this.audio = new Audio( src );
		this.audio.loop = true;
		this.context = window.AudioContext ? new window.AudioContext( ) : new window.webkitAudioContext( );

		this.proc = this.context.createScriptProcessor ?
					this.context.createScriptProcessor( Dancer.SAMPLE_SIZE / 2, 1, 1 ) :
					this.context.createJavaScriptNode( Dancer.SAMPLE_SIZE / 2, 1, 1 );
		this.gain = this.context.createGainNode();

		this.fft = new FFT( Dancer.SAMPLE_SIZE / 2, Dancer.SAMPLE_RATE );
		this.signal = new Float32Array( Dancer.SAMPLE_SIZE / 2 );

		this.frequency = [ 0, 10 ];
		this.threshold = 0.2;
		this.decay     = 0.02;

		this.currentThreshold = this.threshold;

		var __this__ = this;

		this.proc.onaudioprocess = function ( e ) {
			__this__.update.call( __this__, e );
		};

		if ( this.audio.readyState < 3 ) {
			this.audio.addEventListener( 'canplay', function ( ) {
				__this__.connectContext( );
			} );
		} else {
			this.connectContext( );
		}

		this.audio.addEventListener( 'progress', function ( e ) {
			if ( e.currentTarget.duration ) {
				__this__.progress = e.currentTarget.seekable.end( 0 ) / e.currentTarget.duration;
			}
		} );

	}

	Events.mixTo( Dancer );

	Dancer.prototype.spectrum = function( ){
		return this.fft.spectrum;
	};
	Dancer.prototype.waveform = function( ){
		return this.signal;
	};
	Dancer.prototype.time = function( ){
		return this.audio.currentTime;
	};

	
	Dancer.prototype.play = function( ){
		this.audio.play( );
	};

	Dancer.prototype.pause = function( ){
		this.audio.pause( );
	};

	Dancer.prototype.update = function ( e ) {

		var
		buffers = [],
		channels = e.inputBuffer.numberOfChannels,
		resolution = Dancer.SAMPLE_SIZE / channels,
		sum = function ( prev, curr ) {
		return prev[ i ] + curr[ i ];
		}, i;

		for ( i = channels; i--; ) {
			buffers.push( e.inputBuffer.getChannelData( i ) );
		}

		for ( i = 0; i < resolution; i++ ) {
			this.signal[ i ] = channels > 1 ?
			buffers.reduce( sum ) / channels :
			buffers[ 0 ][ i ];
		}

		this.fft.forward( this.signal );


		var magnitude = this.maxAmplitude( this.frequency );

		if ( magnitude >= this.currentThreshold && magnitude >= this.threshold ) {
			this.currentThreshold = magnitude;
			this.trigger( Dancer.ON_KICK, magnitude );
		} else {
			this.trigger( Dancer.OFF_KICK, magnitude );
			this.currentThreshold -= this.decay;
		}

		this.trigger( Dancer.DANCING, magnitude );

	};

	Dancer.prototype.connectContext = function ( ) {

		this.source = this.context.createMediaElementSource( this.audio );

		this.source.connect( this.proc );
		this.source.connect( this.gain );

		this.gain.connect( this.context.destination );
		this.proc.connect( this.context.destination );

	};

	Dancer.prototype.maxAmplitude = function( frequency ){

		var max = 0,
			fft = this.spectrum( );

		if ( !frequency.length ) {
			return frequency < fft.length ?
			fft[ ~~frequency ] :
			null;
		}

		for ( var i = frequency[ 0 ], l = frequency[ 1 ]; i <= l; i++ ) {
			if ( fft[ i ] > max ) { max = fft[ i ]; }
		}
		return max;
	};

	Dancer.SAMPLE_SIZE = 2048;
	Dancer.SAMPLE_RATE = 44100;

	Dancer.ON_KICK = 'onKick';
	Dancer.OFF_KICK = 'offKick';
	Dancer.DANCING = 'dancing';

	module.exports = Dancer;

} );