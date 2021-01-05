/**
 * Client object with HTML element
 * @extends {Socket}
 */
class Client extends Socket {

    /**
     * Constructor
     * @param {Number} local_port 
     * @param {String} remote_address 
     * @param {Number} remote_port 
     */
    constructor(local_port, remote_address, remote_port){
        super(local_port);

        /**
         * IP to send messages to
         * @type {String}
         */
        this.remote_address = remote_address;
        
        /**
         * Port to send messages to
         * @type {Number}
         */
        this.remote_port = remote_port;

        /**
         * Client element
         * @type {ClientElement}
         */
        this.element = document.createElement('udp-client');

        // On delete emit event upwards
        this.element.addEventListener('delete', (event) => {
            this.emit('delete');
        });

        // On message send the message
        this.element.addEventListener('message', (event) => {
            this.sendMessage(event.detail);
        });
    }

    /**
     * Get the ClientElement
     * @returns {ClientElement}
     */
    getElement(){
        return this.element;
    }

    /**
     * Remove the ClientElement
     */
    remove(){
        this.element.remove();
    }

    /**
     * Render the client's HTML element
     */
    render(){
        this.element.setName(`${this.remote_address}:${this.remote_port}`);
    }

    /**
     * Send a message
     * @param {String} message 
     */
    sendMessage(message){
        const buffer = Buffer.from(message);
        this.socket.send(buffer, this.remote_port, this.remote_address);
    }

    /**
     * Render the element.
     */
    initialize(){
        this.render();
    }
}