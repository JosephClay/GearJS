test('Tick', function() {
	var tick = Gear.Tick;

	ok(tick.setFPS(60), 'FPS set');
	ok(tick.getFPS() === 60, 'FPS retrieved');

	ok(tick.isPaused() === false, 'tick does not start out paused');
	tick.pause();
	ok(tick.isPaused() === true, 'tick is paused');
	tick.play();

	ok(_.isNumber(tick.getTime()), 'time retrieved from tick');
	ok(_.isNumber(tick.getTicks()), 'ticks retrieved from tick');
});

asyncTest('Tick: async', function() {
	expect(3);
	
	var tick = Gear.Tick,
		startTicks = tick.getTicks(),
		startTime = tick.getTime();

	var tests = function() {
		ok(startTicks > 0, 'ticks are greater than 0');
		ok(startTime < tick.getTime(), 'time is progressing');
		ok(startTicks < tick.getTicks(), 'ticks are incrementing');
		start();
	};

	setTimeout(tests, 60);
});