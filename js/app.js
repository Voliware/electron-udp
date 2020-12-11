const Dgram = require('dgram');

/**
 * Main application.
 */
class ElectronUdp {

    /**
     * Constructor
     */
    constructor(){

        /**
         * Table to display all clients
         * @type {HTMLElement}
         */
        this.client_table = document.getElementById('client:table');

        /**
         * Form to add a new client
         * @type {HTMLElement}
         */
        this.client_form = document.getElementById('client:form');

        /**
         * Map of client settings. These are not clients themselves
         * as only one client is actually needed.
         * @type {Map<String, Object>}
         */
        this.clients = new Map();

        /**
         * The actual UDP client that will send data.
         * Can send to different Ips and ports
         * @type {Socket}
         */
        this.client = Dgram.createSocket('udp4');
        
        /**
         * Table to display all servers
         * @type {HTMLElement}
         */
        this.server_table = document.getElementById('server:table');
        
        /**
         * Form to add a new server
         * @type {HTMLElement}
         */
        this.server_form = document.getElementById('server:form');
        
        /**
         * Map of servers
         * @type {Map<String, Socket>}
         */
        this.servers = new Map();

        // Create a new client when the client form is submitted
        this.client_form.addEventListener('submit', (event) => {
            event.preventDefault();
            let formdata = new FormData(this.client_form);
            this.createClient({
                ip: formdata.get('ip'),
                port: formdata.get('port')
            });
        });

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
     * Create a client.
     * Add it to the client map. 
     * Create a row in the client table.
     * @param {Object} params
     * @param {String} params.ip
     * @param {Number} params.port 
     */
    createClient({ip, port}){
        let id = `${ip}:${port}`;
        if(this.clients.get(id)){
            return;
        }
        this.clients.set(id, {ip, port});
        this.createClientRow(id);
    }

    /**
     * Delete a client.
     * Remove it from the client map
     * Remove the row from the client table.
     * @param {String} id 
     */
    deleteClient(id){
        if(!this.clients.get(id)){
            return;
        }
        document.getElementById(`client:row:${id}`).remove();
        this.clients.delete(id);
    }

    /**
     * Create a client row
     * @param {String} id 
     */
    createClientRow(id){
        // Clone the template
        let template = document.getElementById('client:row:template');
        let element = template.content.cloneNode(true);
        let tr = element.querySelector('tr');
        tr.id = `client:row:${id}`;
        // Set the client id 
        element.querySelector('[data-name="id"]').innerHTML = id
        // Setup the send message input and button
        let message1 = element.querySelector('[name="message1"]');
        let send = element.querySelector('[name="send"]');
        send.addEventListener('click', (event) => {
            this.sendMessage(id, message1.value);
            message1.value = "";
        });
        // Setup the interval option
        let message2 = element.querySelector('[name="message2"]')
        let delay = element.querySelector('[name="delay"]');
        let enable = element.querySelector('[name="enable"]');
        let state = false;
        let interval = null;
        enable.addEventListener('click', (event) => {
            if(state){
                clearInterval(interval);
            }
            else {
                interval = setInterval(() => {
                    this.sendMessage(id, message2.value);
                }, delay.value);
            }
            state = !state;
            enable.innerHTML = state ? "Disable" : "Enable";
        });
        // Setup the delete button
        let del = element.querySelector('[name="delete"]');
        del.addEventListener('click', (event) => {
            this.deleteClient(id);
        });
        // Append to table
        this.client_table.appendChild(element);
    }

    /**
     * Send a message 
     * @param {String} id - Client ID, ie localhost:1234
     * @param {String} message 
     */
    sendMessage(id, message){
        let client = this.clients.get(id);
        if(!client){
            return;
        }
        let buffer = Buffer.from(message);
        this.client.send(buffer, client.port, client.ip);
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
        let id = `${host}:${port}`
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
        let template = document.getElementById('server:row:template');
        let element = template.content.cloneNode(true);
        let tr = element.querySelector('tr');
        tr.id = `server:row:${id}`;
        // Set the client id 
        element.querySelector('[data-name="id"]').innerHTML = id
        let messages = element.querySelector('[data-name="messages"]');
        messages.id = `server:messages:${id}`;
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
        let messages = document.getElementById(`server:messages:${id}`);
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
        document.getElementById(`server:row:${id}`).remove();
        this.servers.delete(id);
    }
}