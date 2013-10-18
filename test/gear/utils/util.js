test('Util', function() {
	var util = Gear.Util;

	ok(util, 'Utils');

	// TODO: Utilities have specific use cases that will need to be tested
});

test('Util.extend', function() {

	// extend ------------
	var extend = Gear.Util.extend;

	// Test variables
	var timesCalled = 0;
	
	// Test 1 ------------
	var Test1 = function() {
		timesCalled++;
		this.test1Constructor = true;
	};
	Test1.extend = extend;

	Test1.prototype = {
		get: function() {
			return 1;
		},
		testGet1: function() {
			return 1;
		}
	};

	ok(new Test1() && timesCalled === 1, 'Constructor called once');
	ok(new Test1().test1Constructor === true, 'Plain constructor called');
	ok(new Test1().testGet1() === 1, 'Plain prototype function called');
	ok(new Test1().get() === 1, 'Plain prototype function called again');
	ok(Test1.extend, 'extend is still present');
	
	// Test 2 ------------
	var Test2 = Test1.extend({
		get: function() {
			return 2;
		},
		testGet2: function() {
			return 2;
		}
	});

	timesCalled = 0;

	ok(new Test2() && timesCalled === 1, 'Constructor called once');
	ok(new Test2().test1Constructor === true, 'Test2 called Test1 constructor');
	ok(new Test2().testGet1() === 1, 'Test1 prototype is still available');
	ok(new Test2().testGet2() === 2, 'Test2 prototype is has been added');
	ok(new Test2().get() === 2, 'Test2 prototype overwrote Test1 prototype');
	ok(Test2.extend, 'extend is still present');

	// Test 3 ------------
	var Test3 = Test2.extend(function() {
		timesCalled++;
		this.test3Constructor = true;
	},
	{	
		get: function() {
			return 3;
		},
		testGet3: function() {
			return 3;
		}
	});
	
	timesCalled = 0;

	ok(new Test3() && timesCalled === 2, 'Constructor called twice');
	ok(new Test3().test3Constructor === true, 'Test3 constructor called');
	ok(new Test3().test1Constructor === true, 'Test3 constructor called Test1 constructor');
	ok(new Test3().testGet1() === 1, 'Test1 prototype is still available');
	ok(new Test3().testGet2() === 2, 'Test2 prototype is still available');
	ok(new Test3().testGet3() === 3, 'Test3 prototype has been added');
	ok(new Test3().get() === 3, 'Test3 prototype overwrote Test2 prototype');
	ok(Test3.extend, 'extend is still present');

	// Test 4 ------------
	var Test4 = Test1.extend(function() {
		timesCalled++;
		this.test4Constructor = true;
	},
	{
		get: function() {
			return 4;
		},
		testGet4: function() {
			return 4;
		}
	});

	timesCalled = 0;

	ok(new Test4() && timesCalled === 2, 'Constructor called twice');
	ok(new Test4().test4Constructor === true, 'Test4 constructor called');
	ok(new Test4().test1Constructor === true, 'Test1 constructor called Test1 constructor');
	ok(new Test4().testGet1() === 1, 'Test1 prototype is still available');
	ok(new Test4().get() === 4, 'Test4 prototype overwrote Test1 prototype');
	ok(Test4.extend, 'extend is still present');

	// Test 5 ------------
	var Test5 = Test4.extend(function() {
		timesCalled++;
		this.test5Constructor = true;
	},
	{
		get: function() {
			return 5;
		},
		testGet5: function() {
			return 5;
		}
	});

	timesCalled = 0;
	
	ok(new Test5() && timesCalled === 3, 'Constructor called three times');
	ok(new Test5().test5Constructor === true, 'Test5 constructor called');
	ok(new Test5().test4Constructor === true, 'Test4 constructor called');
	ok(new Test5().test1Constructor === true, 'Test1 constructor called Test1 constructor');
	ok(new Test5().testGet1() === 1, 'Test5 prototype is still available');
	ok(new Test5().get() === 5, 'Test5 prototype overwrote Test1 prototype');
	ok(Test5.extend, 'extend is still present');

	// Test 6 ------------
	var Test6 = function(param) {
		timesCalled++;
		this.passedParam = param;
		this.test6Constructor = true;
	};
	Test6 = Test5.extend(Test6, {
		get: function() {
			return 6;
		},
		testGet6: function() {
			return 6;
		}
	});
	
	timesCalled = 0;

	ok(new Test6() && timesCalled === 4, 'Constructor called four times');
	ok(new Test6(true).passedParam === true, 'Parameter passed to constructor correctly');
	ok(new Test6().test6Constructor === true, 'Test6 constructor called');
	ok(new Test6().test5Constructor === true, 'Test5 constructor called');
	ok(new Test6().test4Constructor === true, 'Test4 constructor called');
	ok(new Test6().test1Constructor === true, 'Test1 constructor called Test1 constructor');
	ok(new Test6().testGet1() === 1, 'Test1 prototype is still available');
	ok(new Test6().get() === 6, 'Test6 prototype overwrote Test1 prototype');
	ok(Test6.extend, 'extend is still present');

	// Test 7 ------------
	var Test7 = Test6.extend(function(param, param2) {
		timesCalled++;
		this.passedParam2 = param2;
		this.test7Constructor = true;
	}, {
		initialize: function() {
			this.initialize7 = true;
		}
	});
	
	timesCalled = 0;

	ok(new Test7() && timesCalled === 5, 'Constructor called five times');
	ok(new Test7(true).passedParam === true, 'Parameter passed to Test6 constructor correctly');
	ok(new Test7().passedParam === undefined, 'Not passing the parameter to Test6 results in no paramter');
	ok(new Test7(true).passedParam2 === undefined, 'Not passing a parameter to Test7 results in no parameter');
	ok(new Test7(true, true).passedParam === true && new Test7(true, true).passedParam2 === true, 'Passing two parameters results in two true parameters');
	ok(new Test7().initialize7 === undefined, 'initialize wasnt called due to constructor');

	// Test 8 ------------
	var Test8 = Test7.extend({
		initialize: function() {
			this.initialize8 = true;
		}
	});
	
	timesCalled = 0;

	ok(new Test8() && timesCalled === 5, 'Constructor called five times');
	ok(new Test8(true, true).passedParam === true && new Test8(true, true).passedParam2 === true, 'Passing two parameters results in two true parameters due to previous constructors');
	ok(new Test8().initialize7 === undefined, 'initialize7 wasnt called due to initialize8');
	ok(new Test8().initialize8 === true, 'initialize8 was called due to no constructor');

});