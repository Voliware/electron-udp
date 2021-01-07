/**
 * Main application.
 */
class App {

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
         * @type {Map<String, Socket>
         */
        this.sockets = new Map();

        // On client creation, get or create a socket for the client
        this.client_manager.on('create', async (client) => {
            const id = this.createSocketId(client.getLocalAddress(), client.getLocalPort());
            let socket = this.getSocket(id);
            if(!socket){
                socket = await this.createSocket(client.getLocalAddress(), client.getLocalPort());
            }
            client.setSocket(socket);
            client.initialize();
        });
        
        // On server creation, get or create a socket for the server
        this.server_manager.on('create', async (server) => {
            const id = this.createSocketId(server.getLocalAddress(), server.getLocalPort());
            let socket = this.getSocket(id);
            if(!socket){
                socket = await this.createSocket(server.getLocalAddress(), server.getLocalPort());
            }
            server.setSocket(socket);
            server.initialize();
        });
    }

    /**
     * Create a socket id 
     * @param {String} address 
     * @param {Number} port 
     * @returns {String}
     */
    createSocketId(address, port){
        return `${address}:${port}`;
    }

    /**
     * Create a socket and add it to the map once bound.
     * Once bound, returns socket.
     * @param {String} [address='0.0.0.0'] 
     * @param {Number} [port=0] 
     * @returns {Promise<Socket>}
     */
    createSocket(address = '0.0.0.0', port = 0){
        const socket = Dgram.createSocket('udp4');
        return new Promise((resolve, reject) => {
            socket.bind(port, address, () => {
                const addr = socket.address();
                const id = this.createSocketId(addr.address, addr.port);
                this.sockets.set(id, socket);
                resolve(socket);
            });
        })
    }

    /**
     * Get a UDP socket based on the id.
     * @param {String} id
     * @returns {Socket}
     */
    getSocket(id){
        return this.sockets.get(id);
    }
}