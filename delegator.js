(function(root, factory) {
    if (typeof exports === 'object') {
        factory(exports);
    } else if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else {
        factory(root);
    }
})(this, function(exports) {
    var Delegator = function() {
        this.init.apply(this, arguments);
    };

    Delegator.prototype = {
        constructor: Delegator,

        init: function() {
            // Write initialize code.
        }
    };

    exports.Delegator = Delegator;
});
