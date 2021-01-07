/**
 * Manages and adds UDP servers
 * @extends {EventSystem}
 */
class ServerManager extends EventSystem {

    /**
     * Constructor
     */
    constructor(){
        super();

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
         * @type {Map<String, Server>}
         */
        this.servers = new Map();

        // Create a new server when the server form is submitted
        this.server_form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formdata = new FormData(this.server_form);
            this.createServer({
                local_address: formdata.get('local.address'),
                local_port: parseInt(formdata.get('local.port'))
            });
        });
    }

    /**
     * Create a server ID for the server map
     * @param {String} local_address 
     * @param {Number} local_port 
     * @returns {String}
     */
    createServerId(local_address, local_port){
        return `${local_address}:${local_port}`;
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
        const id = this.createServerId(local_address, local_port);
        if(this.servers.get(id)){
            return;
        }

        const server = new Server(local_address, local_port);

        // On delete, delete the server
        server.on('delete', () => {
            this.deleteServer(id);
        });
        
        this.servers.set(id, server);
        this.server_elements.appendChild(server.getElement());
        
        this.emit('create', server);
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
            server.remove();
            this.servers.delete(id);
        }
    }
}