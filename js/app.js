const Dgram = require('dgram');

/**
 * Main application.
 */
class ElectronUdp {

    /**
     * Constructor
     */
    constructor(){
        this.client_manager = new ClientManager();
        this.server_manager = new ServerManager();
        this.generator = new Generator();
    }
}