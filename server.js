const { Server } = require('http');
const net = require('net');

/*
* Servidor que realiza operaoes matematicas"
*/

function connectionLinistener(socket) {

    socket.on("data", (data) => {
        const comando = data.toString().trim()
        if(comando==="0"){
            socket.write('Agradeçemos pela visita');
        }else{
            hora = Math.floor(Math.random() * (2 - 0)) + 0
            minuto = Math.floor(Math.random() * (59 - 1)) + 1
            socket.write('O pedido está indo até você 🚴🏼');
            socket.write(` vai chegar em ${hora !== 0 ? hora === 1 ? hora + ' hora e ' : hora + ' horas e ' : ''} ${minuto} minutos`);
        }
    })

    socket.on("end", () => {
        socket.write(" >>> Cliente desconectado")
    })
}

function main() {
    console.log('Iniciando servidor ...')

    const server = net.createServer(connectionLinistener)
    server.listen(3000, '0.0.0.0', () => {
        console.log('Servidor Operante')
    })
} main()