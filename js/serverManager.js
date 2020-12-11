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
        this.server_table = document.getElementById('server-table');
        
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
                host: formdata.get('host'),
                port: formdata.get('port')
            });
        });
    }

    /**
     * Create a server and listen on it.
     * Add it to the servers map.
     * When messages are received, append to the server message output.
     * @param {Object} params
     * @param {String} params.host
     * @param {Number} params.port
     */
    createServer({host, port}){
        let id = `${host}-${port}`
        if(this.servers.get(id)){
            return;
        }
        // Create the row first so we can append starting messages 
        this.createServerRow(id);
        let server = Dgram.createSocket('udp4');
		server.on('listening', () => {
            this.appendToServerMessages(id, `Listening ${id}`)
		});
		server.on('message', (message, rinfo) => {
            this.appendToServerMessages(id, message)
        });
        this.appendToServerMessages(id, `Start ${id}`)
        server.bind(port, host);
        this.servers.set(id, server);
    }

    /**
     * Create a server row.
     * @param {String} id 
     */
    createServerRow(id){
        // Clone the template
        let template = document.getElementById('server-row-template');
        let element = template.content.cloneNode(true);
        let tr = element.querySelector('tr');
        tr.id = `server-row-${id}`;
        // Set the client id 
        element.querySelector('[data-name="id"]').innerHTML = id
        let messages = element.querySelector('[data-name="messages"]');
        messages.id = `server-messages-${id}`;
        // Setup the clear messages button
        let clear = element.querySelector('[name="clear"]');
        clear.addEventListener('click', (event) => {
            messages.innerHTML = '';
        });
        // Setup the delete button
        let del = element.querySelector('[name="delete"]');
        del.addEventListener('click', (event) => {
            this.deleteServer(id);
        });
        // Append to table
        this.server_table.appendChild(element);
    }

    /**
     * Append a message to a server message output.
     * @param {String} id - Id of the server
     * @param {String} message 
     */
    appendToServerMessages(id, message){
        let messages = document.getElementById(`server-messages-${id}`);
        let date = new Date();
        let time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
        messages.innerHTML += `[${time}]${message}\n`;
        messages.scrollTop = messages.scrollHeight;
    }

    /**
     * Delete a server.
     * Remove it from the server map
     * Remove the row from the server table.
     * @param {String} id 
     */
    deleteServer(id){
        let server = this.servers.get(id);
        if(!server){
            return;
        }
        server.close();
        document.getElementById(`server-row-${id}`).remove();
        this.servers.delete(id);
    }
}