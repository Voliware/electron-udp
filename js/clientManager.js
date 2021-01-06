/**
 * Manages and adds UDP clients
 * @extends {EventSystem}
 */
class ClientManager extends EventSystem {

    /**
     * Constructor
     */
    constructor(){
        super();

        /**
         * Table to display all clients
         * @type {HTMLElement}
         */
        this.client_elements = document.getElementById('clients');

        /**
         * Form to add a new client
         * @type {HTMLElement}
         */
        this.client_form = document.getElementById('client-form');

        /**
         * Map of clients.
         * @type {Map<String, Client>}
         */
        this.clients = new Map();

        // Create a new client when the client form is submitted
        this.client_form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formdata = new FormData(this.client_form);
            this.createClient({
                local_port: formdata.get('local.port'),
                remote_address: formdata.get('remote.address'),
                remote_port: formdata.get('remote.port')
            });
        });
    }

    /**
     * Create a client.
     * Add it to the client map. 
     * @param {Object} params
     * @param {Number} params.local_port 
     * @param {String} params.remote_address
     * @param {Number} params.remote_port 
     */
    createClient({local_port, remote_address, remote_port}){
        const id = `${local_port}:${remote_address}:${remote_port}`;
        if(this.getClient(id)){
            return;
        }
        
        const client = new Client(local_port, remote_address, remote_port);
        client.on('delete', () => {
            this.deleteClient(id);
        });
        this.clients.set(id, client);
        this.client_elements.appendChild(client.getElement());

        this.emit('create', client);
    }

    /**
     * Delete a client.
     * Remove it from the client map
     * Remove the element from the client table.
     * @param {String} id 
     */
    deleteClient(id){
        const client = this.getClient(id);
        if(client){
            client.remove();
            this.clients.delete(id);
        }
    }

    /**
     * Get a client from the client map.
     * @param {String} id 
     * @returns {Client|Undefined}
     */
    getClient(id){
        return this.clients.get(id);
    }
}