/**
 * Client element
 * @extends {HTMLElement}
 */
class ClientElement extends HTMLElement {

    /**
     * Constructor
     */
    constructor(){
        super();

        /**
         * Display name.
         * @type {HTMLElement}
         */
        this.name = null;

        /**
         * Delete button.
         * @type {HTMLElement}
         */
        this.delete = null;

        /**
         * Message textarea.
         * @type {HTMLElement}
         */
        this.message = null;

        /**
         * Message encoding select.
         * @type {HTMLElement}
         */
        this.encoding = null;

        /**
         * Interval ms input.
         * @type {HTMLElement}
         */
        this.repeat = null;

        /**
         * Repeat checkbox
         * @type {HTMLElement}
         */
        this.repeat_enable = null;

        /**
         * Data loss % input.
         * @type {HTMLElement}
         */
        this.dataloss = null;

        /**
         * Data loss checkbox
         * @type {HTMLElement}
         */
        this.dataloss_enable = null;

        /**
         * Send message button.
         * @type {HTMLElement}
         */
        this.send = null;

        /**
         * Optional interval to send messages events at.
         * @type {Number}
         */
        this.interval = 0;
    }

    /**
     * Set the client display name
     * @param {String} name 
     */
    setName(name){
        this.name.innerHTML = name;
    }

    /**
     * Get the message value depending on the encoding 
     * @returns {String} 
     */
    getMessage(){
        return this.encoding.value === "hex"
            ? new Buffer.from(this.message.value).toString('hex')
            : this.message.value;
    }

    /**
     * Get the data loss %, if enabled.
     * @returns {Number} - Floating point number between 0 and 100.
     */
    getDataLoss(){
        return this.dataloss_enable.checked ? parseFloat(this.dataloss.value) : 0;
    }

    /**
     * Start the message event interval
     */
    startInterval(){
        this.stopInterval();
        this.interval = setInterval(() => {
            this.dispatchMessageEvent();
        }, parseInt(this.repeat.value));
    }

    /**
     * Stop the message event interval
     */
    stopInterval(){
        clearInterval(this.interval);
    }

    /**
     * Start or stop the message event interval according to input values.
     */
    toggleInterval(){
        if(this.repeat_enable.checked && parseInt(this.repeat.value)){
            this.startInterval();
        }
        else {
            this.stopInterval();
        }
    }

    /**
     * Dispatch an event with the message data.
     */
    dispatchMessageEvent(){
        const detail = this.getMessage();
        const message_event = new CustomEvent('message', {detail});
        this.dispatchEvent(message_event);
    }

    /**
     * Append the template.
     * Capture elements.
     * Attach handlers
     */
    connectedCallback(){
        // Clone the template
        const template = document.getElementById('client-template');
        const node = template.content.cloneNode(true);
        this.appendChild(node);

        // Capture elements
        this.name = this.querySelector('[data-name="id"]');
        this.delete = this.querySelector('[name="delete"]');
        this.message = this.querySelector('[name="message"]');
        this.encoding = this.querySelector('[name="encoding"]');
        this.repeat = this.querySelector('[name="repeat"]');
        this.repeat_enable = this.querySelector('[name="repeat.enable"]');
        this.dataloss = this.querySelector('[name="dataloss"]');
        this.dataloss_enable = this.querySelector('[name="dataloss.enable"]');
        this.send = this.querySelector('[name="send"]');
        
        // On click emit a message event with the message data
        this.send.addEventListener('click', (event) => {
            this.dispatchMessageEvent();
        });

        // On input toggle the interval 
        this.repeat.addEventListener('input', (event) => {
            this.toggleInterval();
        });

        // On change toggle the interval 
        this.repeat_enable.addEventListener('change', (event) => {
            this.toggleInterval();
        });

        // On click emit an event to delete the client
        this.delete.addEventListener('click', (event) => {
            const delete_event = new Event('delete');
            this.dispatchEvent(delete_event);
        });
    }
}
customElements.define('udp-client', ClientElement)