/**
 * Manages and adds UDP clients
 */
class ClientManager {

    /**
     * Constructor
     */
    constructor(){
        /**
         * Table to display all clients
         * @type {HTMLElement}
         */
        this.client_table = document.getElementById('client-table');

        /**
         * Form to add a new client
         * @type {HTMLElement}
         */
        this.client_form = document.getElementById('client-form');

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

        // Create a new client when the client form is submitted
        this.client_form.addEventListener('submit', (event) => {
            event.preventDefault();
            let formdata = new FormData(this.client_form);
            this.createClient({
                ip: formdata.get('ip'),
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
        let id = `${ip}-${port}`;
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
        document.getElementById(`client-row-${id}`).remove();
        this.clients.delete(id);
    }

    /**
     * Create a client row
     * @param {String} id 
     */
    createClientRow(id){
        // Clone the template
        let template = document.getElementById('client-row-template');
        let element = template.content.cloneNode(true);
        let tr = element.querySelector('tr');
        tr.id = `client-row-${id}`;
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
     * @param {String} id - Client ID, ie localhost-1234
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
}