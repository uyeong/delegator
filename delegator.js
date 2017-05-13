(function(root, factory) {
    if (typeof exports === 'object') {
        factory(exports);
    } else if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else {
        factory(root);
    }
})(this, function(exports) {
    function captureForType(type) {
        // https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-eventgroupings-htmlevents
        return ['blur', 'error', 'focus', 'load', 'resize', 'scroll'].indexOf(type) !== -1;
    }

    function merge(/* args */) {
        var target = arguments[0];
        var i, n, key;

        for(i = 1, n = arguments.length; i < n; i++) {
            for (key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    target[key] = arguments[i][key];
                }
            }
        }

        return target;
    }

    function createDelegator(original, options) {
        original = original || document.body;
        options = options || {};
        options.capture = !!options.capture;
        options.passive = !!options.passive;

        var delegates = {};
        var listeners = {};

        function createDelegateListener(type) {
            return function (event) {
                var target = event.target;
                var targetListeners;
                var selector;
                var i, n;

                for (selector in listeners[type]) {
                    if (listeners[type].hasOwnProperty(selector)) {
                        if (target.matches(selector) || target.closest(selector)) {
                            event.delegateTarget = original;
                            targetListeners = listeners[type][selector];

                            for (i = 0, n = targetListeners.length; i < n; i++) {
                                targetListeners[i](event);
                            }
                        }
                    }
                }
            };
        }

        return {
            on: function(type, selector, listener) {
                if (!listeners[type]) {
                    listeners[type] = {};
                }

                if (!listeners[type][selector]) {
                    listeners[type][selector] = [];
                }

                listeners[type][selector].push(listener);

                if (!delegates[type]) {
                    delegates[type] = createDelegateListener(type);
                    original.addEventListener(
                        type,
                        delegates[type],
                        captureForType(type) ? merge({}, options, {capture: true}) : options
                    );
                }
            },

            off(type, selector, listener) {
                if (!listeners[type] || !listeners[type][selector]) {
                    return;
                }

                var targetListeners = listeners[type][selector];
                var i, n;

                for (i = 0, n = targetListeners.length; i < n; i++) {
                    if (targetListeners[i] === listener) {
                        targetListeners.splice(i, 1);
                        break;
                    }
                }

                if (targetListeners.length === 0) {
                    delete listeners[type][selector];
                }

                if (JSON.stringify(listeners[type]) === JSON.stringify({})) {
                    original.removeEventListener(type, delegates[type], options);
                    delete listeners[type];
                    delete delegates[type];
                }
            },

            clear() {
                var type;

                for (type in delegates) {
                    if (delegates.hasOwnProperty(type)) {
                        original.removeEventListener(
                            type,
                            delegates[type],
                            captureForType(type) ? merge({}, options, {capture: true}) : options
                        );
                    }
                }

                listeners = {};
                delegates = {};
            }
        };
    }

    exports.createDelegator = createDelegator;
});
