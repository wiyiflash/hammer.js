var TOUCH_EVENT_MAP = {
    touchstart: EVENT_START,
    touchmove: EVENT_MOVE,
    touchend: EVENT_END,
    touchcancel: EVENT_CANCEL
};

var TOUCH_EVENTS = "touchstart touchmove touchend touchcancel";

/**
 * Touch events input
 * @param {Hammer} inst
 * @param {Function} callback
 * @constructor
 */
Input.Touch = function(inst, callback) {
    this.inst = inst;
    this.callback = callback;

    this._handler = bindFn(this.handler, this);
    addEvent(inst.element, TOUCH_EVENTS, this._handler);
};

Input.Touch.prototype = {
    /**
     * handle touch events
     * @param {Object} ev
     */
    handler: function(ev) {
        var touches = this.normalizeTouches(ev);
        var data = {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        };

        this.callback(this.inst, TOUCH_EVENT_MAP[ev.type], data);
    },

    /**
     * make sure all browsers return the same touches
     * @param {Object} ev
     * @returns {Array} [all, changed]
     */
    normalizeTouches: function(ev) {
        var changedTouches = toArray(ev.changedTouches);
        var touches = toArray(ev.touches).concat(changedTouches);

        return [
            // should contain all the touches, touches + changedTouches
            uniqueArray(touches, "identifier"),
            // should contain only the touches that have changed
            changedTouches
        ];
    },

    /**
     * remove the event listeners
     */
    destroy: function() {
        removeEvent(this.inst.element, TOUCH_EVENTS, this._handler);
    }
};