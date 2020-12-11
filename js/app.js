const Dgram = require('dgram');

/**
 * Main application.
 */
class ElectronUdp {

    /**
     * Constructor
     */
    constructor(){
        this.client_table = document.getElementById('client-table');
        this.client_form = document.getElementById('client-form');

        this.clients = new Map();

        this.client = Dgram.createSocket('udp4');

        this.client_form.addEventListener('submit', (event) => {
            event.preventDefault();
            let formdata = new FormData(this.client_form);
            this.createClient({
                ip: formdata.get('ip'),
                port: formdata.get('port')
            });
        });
        
        this.servers = new Map();
        
        this.server_table = document.getElementById('server-table');
        this.server_form = document.getElementById('server-form');

        this.server_form.addEventListener('submit', (event) => {
            event.preventDefault();
            let formdata = new FormData(this.server_form);
            this.createServer({
                host: formdata.get('host'),
                port: formdata.get('port')
            });
        });
    }

    createClient({ip, port}){
        let id = `${ip}:${port}`;
        if(this.clients.get(id)){
            return;
        }
        this.clients.set(id, {ip, port});
        this.createClientRow(id);
    }

    createClientRow(id){
        // Create the row
        let row = document.createElement('tr');
        row.id = `client:row:${id}`;
        // Create the name column
        let col_1 = document.createElement('td');
        col_1.innerHTML = id;
        // Create the send message column
        let col_2 = document.createElement('td');
        let input = document.createElement('input');
        input.type = "text";
        input.placeholder = "Type a message";
        input.classList.add('form-input');
        let send = document.createElement('button');
        send.id = `client:messages:${id}`;
        send.innerHTML = "Send";
        send.classList.add('btn', 'btn-success');
        send.addEventListener('click', (event) => {
            this.sendMessage(id, input.value);
            input.value = "";
        });
        col_2.appendChild(input);
        col_2.appendChild(send);
        // Append to table
        row.appendChild(col_1);
        row.appendChild(col_2);
        this.client_table.appendChild(row);
    }

    sendMessage(id, message){
        let client = this.clients.get(id);
        let buffer = Buffer.from(message);
        this.client.send(buffer, client.port, client.ip);
    }

    createServer({host, port}){
        let id = `${host}:${port}`
        if(this.servers.get(id)){
            return;
        }
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

    createServerRow(id){
        // Create the row
        let row = document.createElement('tr');
        row.id = `server:row:${id}`;
        // Create the name column
        let col_1 = document.createElement('td');
        col_1.innerHTML = id;
        // Create the messages column
        let col_2 = document.createElement('td');
        let messages = document.createElement('pre');
        messages.id = `server:messages:${id}`;
        messages.classList.add('messages');
        col_2.appendChild(messages);
        // Append to table
        row.appendChild(col_1);
        row.appendChild(col_2);
        this.server_table.appendChild(row);
    }

    appendToServerMessages(id, message){
        let messages = document.getElementById(`server:messages:${id}`);
        let date = new Date();
        let time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
        messages.innerHTML += `[${time}]${message}\n`;
        messages.scrollTop = messages.scrollHeight;
    }
}