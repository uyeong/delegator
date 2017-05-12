(function(root, factory) {
    if (typeof exports === 'object') {
        factory(exports);
    } else if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else {
        factory(root);
    }
})(this, function(exports) {
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
            target: original,
            options: options,

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
                    original.addEventListener(type, delegates[type], options);
                }
            },

            clear() {
                var type;

                for (type in delegates) {
                    if (delegates.hasOwnProperty(type)) {
                        original.removeEventListener(type, delegates[type], options);
                    }
                }

                listeners = {};
                delegates = {};
            }
        };
    }

    exports.createDelegator = createDelegator;
});
