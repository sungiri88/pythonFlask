/**
 * Await version 1.0.0
 * Synchronous loops
 *
 * @author ACFBentveld
 */
class Await {

    
    /**
     * Await class constructor
     * 
     * @returns {Test}
     */
    constructor()
    {
        
        this.config = {
            next: true
        };
        
        this.object = [];

        this.jquery   = $;

        this.callback = null;
        this.elements = null;
        this.resolve  = null;

        this.loop = {
            length: 0,
            iteration: 0
        };

    }
    
    /**
     * Call the each function
     *
     * @param {type} object
     * @param {type} callback
     * @returns {undefined}
     */
    each(object, callback)
    {
        this.callback = callback;
        if(object.length === 0){
            return this.resolve();
        }
        this.cleanObject(object, function (elements) {
            this.loop.length = elements.length;
            this.startLoop(elements);
        }.bind(this));
    }
    
    /**
     * Start the loop iteration
     *
     * @param {type} elements
     * @returns {Boolean|resolve}
     */
    startLoop(elements) {
        if(this.loop.iteration > this.loop.length){
            console.error('The loop is stuck somehow.');
            return false;
        }
        if (typeof elements[this.loop.iteration] === 'undefined') {
            var resolve = this.resolve;
            this.destroy();
            if (typeof resolve === 'function') {
                return resolve(this.object);
            }
            return true;
        }
        this.callback(this.loop.iteration, elements[this.loop.iteration]);
        this.loop.iteration++;
        if (this.config.next) {
            this.startLoop(elements);
        }
    }

    /**
     * Stop all activity
     *
     * @returns {undefined}
     */
    stop() {
        this.config.next = false;
    }

    /**
     * Start all activity
     *
     * @returns {undefined}
     */
    start() {
        this.config.next = true;
        this.startLoop(this.elements);
    }

    /**
     * Clean the object.
     * Reset the index keys
     *
     * @param {type} elements
     * @param {type} callback
     * @returns {undefined}
     */
    cleanObject(elements, callback) {
        var data = [];
        if(this.jquery === jQuery){
            $.each(elements, function(key, value){
                data.push(value);
            });
        }else{
            for (key in elements) {
                data.push(elements[key]);
            }
        }
        this.elements = data;
        callback(data);
    }

    /**
     * Destroy the Await plugin
     *
     * @returns {undefined}
     */
    destroy() {
        this.config = {next: true};
        this.loop = {length: 0, iteration: 0};
        this.callback = null;
        this.resolve = null;
        this.elements = null;
    }

    /**
     * Set the resolve callback
     *
     * @param {type} callback
     * @returns {undefined}
     */
    done(callback) {
        this.resolve = callback;
    }
    

}
