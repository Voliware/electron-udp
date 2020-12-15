/**
 * Client object with HTML element
 * @extends {EventSystem}
 */
class Client extends EventSystem {

    /**
     * Constructor
     * @param {Number} local_port 
     * @param {String} remote_address 
     * @param {Number} remote_port 
     */
    constructor(local_port, remote_address, remote_port){
        super();
        
        /**
         * Port to send messages from
         * @type {Number}
         */
        this.local_port = local_port;

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

        /**
         * The socket to listen on
         * @type {Socket}
         */
        this.socket = Dgram.createSocket('udp4');

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
     * Send a message
     * @param {String} message 
     */
    sendMessage(message){
        const buffer = Buffer.from(message);
        this.socket.send(buffer, this.remote_port, this.remote_address);
    }

    /**
     * Initialize and bind the socket
     */
    initialize(){
        this.socket.bind(this.local_port);
        this.element.setName(`${this.remote_address}:${this.remote_port}`);
    }

    /**
     * Deinitialize and close the socket
     */
    deinitialize(){
        this.socket.close();
    }
}