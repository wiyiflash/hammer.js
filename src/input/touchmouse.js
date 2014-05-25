/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also trigger mouse events while doing a touch.
 *
 * @param {Hammer} inst
 * @param {Function} callback
 * @constructor
 */
Input.TouchMouse = function(inst, callback) {
    this.callback = callback;

    this._handler = bindFn(this.handler, this);
    this.touch = new Input.Touch(inst, this._handler);
    this.mouse = new Input.Mouse(inst, this._handler);
};

Input.TouchMouse.prototype = {
    /**
     * handle mouse and touch events
     * @param {Hammer} inst
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function(inst, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        // when we"re in a touch event, so  block all upcoming mouse events
        // most mobile browser also trigger mouseevents, right after touchstart
        if(isTouch) {
            this.mouse._allow = false;
        } else if(isMouse && !this.mouse._allow) {
            return;
        }

        // reset the allowMouse when we"re done
        if(inputEvent == EVENT_END) {
            this.mouse._allow = true;
        }

        this.callback(inst, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function() {
        this.touch.destroy();
        this.mouse.destroy();
    }
};