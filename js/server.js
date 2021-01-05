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

        // On delete emit event upwards
        this.element.addEventListener('delete', (event) => {
            this.emit('delete');
        });
    }

    /**
     * Render the server's HTML element
     */
    render(){
        this.element.setName(`${this.local_address}:${this.local_port}`);
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

        // On listening append to the messages textarea
		this.socket.on('listening', () => {
            this.element.appendMessage(`Listening`)
        });
        
        // On message append to the messages textarea
		this.socket.on('message', (message, rinfo) => {
            this.element.appendMessage(message, rinfo)
        });

        this.render();
    }
}