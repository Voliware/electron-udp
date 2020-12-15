/**
 * Manages and adds UDP servers
 */
class ServerManager {

    /**
     * Constructor
     */
    constructor(){

        /**
         * Table to display all servers
         * @type {HTMLElement}
         */
        this.server_elements = document.getElementById('servers');
        
        /**
         * Form to add a new server
         * @type {HTMLElement}
         */
        this.server_form = document.getElementById('server-form');
        
        /**
         * Map of servers
         * @type {Map<String, Socket>}
         */
        this.servers = new Map();

        // Create a new server when the server form is submitted
        this.server_form.addEventListener('submit', (event) => {
            event.preventDefault();
            let formdata = new FormData(this.server_form);
            this.createServer({
                local_address: formdata.get('local.address'),
                local_port: formdata.get('local.port')
            });
        });
    }

    /**
     * Create a server and listen on it.
     * Add it to the servers map.
     * When messages are received, append to the server message output.
     * @param {Object} params
     * @param {String} params.local_address
     * @param {Number} params.local_port
     */
    createServer({local_address, local_port}){
        const id = `${local_address}:${local_port}`
        if(this.servers.get(id)){
            return;
        }

        const server = new Server(local_address, local_port);
        server.on('delete', () => {
            this.deleteServer(id);
        });
        this.servers.set(id, server);
        this.server_elements.appendChild(server.getElement());
        server.initialize();
    }

    /**
     * Delete a server.
     * Remove it from the server map
     * Remove the element from the server table.
     * @param {String} id 
     */
    deleteServer(id){
        const server = this.servers.get(id);
        if(server){
            server.deinitialize();
            server.remove();
            this.servers.delete(id);
        }
    }
}