/**
 * Client object with HTML element
 * @extends {Socket}
 */
class Client extends Socket {

    /**
     * Constructor
     * @param {String} local_address
     * @param {Number} local_port 
     * @param {String} remote_address 
     * @param {Number} remote_port 
     */
    constructor(local_address, local_port, remote_address, remote_port){
        super(local_address, local_port);

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
     * Get the remote address
     * @returns {String}
     */
    getRemoteAddress(){
        return this.remote_address;
    }

    /**
     * Get the remote port
     * @returns {Number}
     */
    getRemotePort(){
        return this.remote_port;
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
        const addr = this.socket.address();
        this.element.setName(`${addr.address}:${addr.port} -> ${this.remote_address}:${this.remote_port}`);
    }

    /**
     * Send a message.
     * If dataloss is enabled, randomly fail based on the percentage.
     * @param {String} message 
     */
    sendMessage(message){
        // Determine if we should pretend to lose data
        const random = Math.random() * 100;
        const dataloss = random < this.element.getDataLoss();
        if(dataloss){
            console.log('Dataloss purposefully occurred');
            return;
        }

        // Send message
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