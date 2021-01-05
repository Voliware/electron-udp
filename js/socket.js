/**
 * Socket object with HTML element.
 * Base class for Client and Server.
 * @extends {EventSystem}
 */
class Socket extends EventSystem {

    /**
     * Constructor
     * @param {Number} local_port 
     */
    constructor(local_port = 0){
        super(local_port);
        
        /**
         * Port to send messages from or listen on
         * @type {Number}
         */
        this.local_port = local_port;

        /**
         * The socket to bind and send or receive datagrams from.
         * Must be set externally.
         * @type {Socket}
         */
        this.socket = null;
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