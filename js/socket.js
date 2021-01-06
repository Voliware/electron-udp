/**
 * Socket object with HTML element.
 * Base class for Client and Server.
 * @extends {EventSystem}
 */
class Socket extends EventSystem {

    /**
     * Constructor
     * @param {String} [local_address='0.0.0.0']
     * @param {Number} [local_port=0] 
     */
    constructor(local_address = '0.0.0.0', local_port = 0){
        super();
        
        /**
         * Port to send messages from or listen on
         * @type {Number}
         */
        this.local_port = local_port;

        /**
         * Address to send messages from or listen on
         * @type {String}
         */
        this.local_address = local_address;

        /**
         * The socket to bind and send or receive datagrams from.
         * Must be set externally.
         * @type {Socket}
         */
        this.socket = null;
    }

    /**
     * Get the local address
     * @returns {String}
     */
    getLocalAddress(){
        return this.local_address;
    }

    /**
     * Get the local port
     * @returns {Number}
     */
    getLocalPort(){
        return this.local_port;
    }

    /**
     * Set the socket
     * @param {Socket} socket 
     */
    setSocket(socket){
        this.socket = socket;
    }
}