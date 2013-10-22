(function(Gear) {

	var _BODY = Gear.Global.DOC.getElementsByTagName('body')[0],
		_isPreventing = false;

	Gear.ContextMenu = {
		prevent: function() {
			if (_isPreventing) { return; }

			_BODY.setAttribute('oncontextmenu', 'return false;');
			_isPreventing = true;
		},
		allow: function() {
			if (!_isPreventing) { return; }

			_BODY.removeAttribute('oncontextmenu');
			_isPreventing = false;
		}
	};

}(Gear));