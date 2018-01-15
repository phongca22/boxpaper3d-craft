var APP_STATE = {
	prefix: "app",
	COLLABORATION: {
		id: "collaboration",
		getState: getAppState
	}
};

function getAppState() {
	for (var key in APP_STATE) {
		if (APP_STATE[key].id == this.id) {
			return APP_STATE.prefix + "." + APP_STATE[key].id;
		}
	}

	return "";
}

var APP_CONF = {
	context: window.location.protocol + "//" + window.location.host,
	directory: "app",
	module: "coolbox",
	home: APP_STATE.COLLABORATION.getState(),
	api: window.location.protocol + "//" + window.location.host + "/api",
	token: "token",
	directiveApp: "dtDirective",
	primaryPalette: "teal",
	accentPalette: "blue",
	getStateName: function (name) {
		for (var key in APP_STATE) {
			if (!APP_STATE[key].id) continue;
			if (APP_STATE[key].getState() == name) return APP_STATE[key].name;
		}

		return "";
	},
	isAPI: function (path) {
		return path.indexOf(this.api) == 0;
	}
};

var AlertUtil = {
	config: function (t) {
		this.service = t;
		this.TYPE = {
			INFO: "info",
			SUCCESS: "success",
			ERROR: "error"
		};
	},
	show: function (f, m) {
		if (!m) {
			this.service[f]({
				msg: "Error"
			});
			return;
		}

		if (angular.isArray(m)) {
			for (var i = 0; i < m.length; i++) {
				this.service[f]({
					msg: m[i]
				})
			}
		} else {
			this.service[f]({
				msg: m
			})
		}
	},
	error: function (m) {
		this.show(this.TYPE.ERROR, m);
	},
	success: function (m) {
		this.show(this.TYPE.SUCCESS, m);
	},
	info: function () {
		this.show(this.TYPE.INFO, m);
	}
};

var PanelUtil = {
    config: function(service) {
        this.service = service;
    },
    show: function(controller, option, ev) {
        if (!this.service)
            return;
        var opt = option || {};
        var position = this.service.newPanelPosition()
                .relativeTo(ev.srcElement).addPanelPosition(
                        opt.x || this.service.xPosition.OFFSET_END,
                        opt.y || this.service.yPosition.ALIGN_TOPS);

        var config = {
            attachTo: angular.element(document.body),
            controller: controller,
            controllerAs: 'ctrl',
            position: position,
            openFrom: ev,
            clickOutsideToClose: angular.isDefined(opt.clickOutsideToClose) ? opt.clickOutsideToClose
                    : true,
            escapeToClose: angular.isDefined(opt.escapeToClose) ? opt.escapeToClose
                    : true
        };

        if (opt.templateUrl) {
            config.templateUrl = opt.templateUrl;
        } else {
            config.template = opt.template || "";
        }

        this.service.open(config);
    }
};
