/**
 * Server element
 * @extends {HTMLElement}
 */
class ServerElement extends HTMLElement {

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
         * Clear messages button.
         * @type {HTMLElement}
         */
        this.clear = null;

        /**
         * Messages textarea.
         * @type {HTMLElement}
         */
        this.messages = null;
    }

    /**
     * Set the server display name
     * @param {String} name 
     */
    setName(name){
        this.name.innerHTML = name;
    }

    /**
     * Append the template.
     * Capture elements.
     * Attach handlers
     */
    connectedCallback(){
        // Clone the template
        const template = document.getElementById('server-template');
        const node = template.content.cloneNode(true);
        this.appendChild(node);

        // Capture elements
        this.name = this.querySelector('[data-name="id"]');
        this.messages = this.querySelector('[data-name="messages"]');
        this.clear = this.querySelector('[name="clear"]');
        this.delete = this.querySelector('[name="delete"]');

        // On click emit an event to delete the server
        this.delete.addEventListener('click', (event) => {
            const delete_event = new Event('delete');
            this.dispatchEvent(delete_event);
        });

        // On click clear all messages
        this.clear.addEventListener('click', (event) => {
            this.messages.innerHTML = '';
        });
    }

    /**
     * Append a message to the message output.
     * @param {String} message 
     * @param {Object} rinfo
     */
    appendMessage(message, rinfo = null){
        const date = new Date();
        const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
        const recv = rinfo ? `[${rinfo.address}:${rinfo.port}]` : '';
        this.messages.innerHTML += `[${time}] ${recv} ${message}\n`;
        this.messages.scrollTop = this.messages.scrollHeight;
    }
}
customElements.define('udp-server', ServerElement)