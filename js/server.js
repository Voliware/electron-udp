/**
 * Server object with HTML element
 * @extends {EventSystem}
 */
class Server extends EventSystem {

    /**
     * Constructor
     * @param {String} local_address 
     * @param {Number} local_port 
     */
    constructor(local_address, local_port){
        super();

        /**
         * Host to listen on
         * @type {String}
         */
        this.local_address = local_address;
        
        /**
         * Port to listen on
         * @type {Number}
         */
        this.local_port = local_port;

        /**
         * Server element
         * @type {ServerElement}
         */
        this.element = document.createElement('udp-server');

        /**
         * The socket to listen on
         * @type {Socket}
         */
        this.socket = Dgram.createSocket('udp4');
        
        // On listening append to the messages textarea
		this.socket.on('listening', () => {
            this.element.appendMessage(`Listening`)
        });
        
        // On message append to the messages textarea
		this.socket.on('message', (message, rinfo) => {
            this.element.appendMessage(message, rinfo)
        });

        // On delete emit event upwards
        this.element.addEventListener('delete', (event) => {
            this.emit('delete');
        });
    }

    /**
     * Get the ServerElement
     * @returns {ServerElement}
     */
    getElement(){
        return this.element;
    }

    /**
     * Remove the ServerElement
     */
    remove(){
        this.element.remove();
    }

    /**
     * Initialize and bind the socket
     */
    initialize(){
        this.socket.bind(this.local_port, this.local_address);
        this.element.setName(`${this.local_address}:${this.local_port}`);
    }

    /**
     * Deinitialize and close the socket
     */
    deinitialize(){
        this.socket.close();
    }
}