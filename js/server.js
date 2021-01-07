/**
 * Server object with HTML element
 * @extends {Socket}
 */
class Server extends Socket {

    /**
     * Constructor
     * @param {String} local_address 
     * @param {Number} local_port 
     */
    constructor(local_address, local_port){
        super(local_address, local_port);

        /**
         * Server element
         * @type {ServerElement}
         */
        this.element = document.createElement('udp-server');

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
     * Render the server's HTML element
     */
    render(){
        const addr = this.socket.address();
        this.element.setName(`${addr.address}:${addr.port}`);
    }

    /**
     * Initialize the server.
     * Render the element.
     * Attach handlers to the socket.
     * Socket must be set.
     */
    initialize(){
        if(!this.socket){
            console.error('Server socket has not been set');
            return;
        }

        this.element.appendMessage(`Listening`);

        // On message append to the messages textarea
		this.socket.on('message', (message, rinfo) => {
            this.element.appendMessage(message, rinfo)
        });

        this.render();
    }
}