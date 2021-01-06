/**
 * Main application.
 */
class ElectronUdp {

    /**
     * Constructor
     */
    constructor(){
        /**
         * Client manager
         * @type {ServerManager}
         */
        this.client_manager = new ClientManager();

        /**
         * Server manager
         * @type {ServerManager}
         */
        this.server_manager = new ServerManager();

        /**
         * Random data generator
         * @type {Generator}
         */
        this.generator = new Generator();

        /**
         * Map of sockets.
         * Can be shared between multiple clients/servers.
         * @type {Map<Number, Socket>
         */
        this.sockets = new Map();

        // On client creation, get or create a socket for the client
        this.client_manager.on('create', client => {
            const socket = this.getSocket(client.getLocalPort());
            client.setSocket(socket);
            client.initialize();
        });

        // On port establishment, update the sockets map
        this.client_manager.on('port', port => {
            // The socket port would have been 0
            const socket = this.sockets.get(0);
            if(socket){
                this.sockets.set(port, socket);
                this.sockets.delete(0);
            }
        });
        
        // On server creation, get or create a socket for the server
        this.server_manager.on('create', server => {
            const socket = this.getSocket(server.getLocalPort());
            server.setSocket(socket);
            server.initialize();
        });
    }

    /**
     * Get or create a UDP socket based on a port.
     * This allows sharing a socket between clients and servers.
     * @param {Number} port 
     * @returns {Socket}
     */
    getSocket(port){
        let socket = this.sockets.get(port);
        if(!socket){
            socket = Dgram.createSocket('udp4');
            if(port > 0){
                socket.bind(port);
            }
            this.sockets.set(port, socket);
        }
        return socket;
    }
}