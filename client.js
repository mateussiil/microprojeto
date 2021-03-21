const net = require("net");

const client = net.Socket();
var readlineSync = require('readline-sync');


const foods = [
    {
        "index": 1,
        "name": "Macarrao",
        "value": 15.00
    },
    {
        "index": 2,
        "name": "Feijão",
        "value": 4.50
    },
    {
        "index": 3,
        "name": "Cachorro quente",
        "value": 10.00
    },
    {
        "index": 4,
        "name": "Pizza",
        "value": 30.00
    }
]

var pedidos = []

const valorTotal = () => {
    console.log('Seu pedido está dando ' + pedidos.reduce((total, item) => {
        return total + (item.value);
    }, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
}


function connectionListener() {
    console.log("Estou conectado!");

    client.on("data", function (data) {
        const resposta = data.toString();

        console.log(resposta);
    });

    console.log("0 - Lista de comandos\n");
    comando = readlineSync.question('Digite o comando: ')

    while (true) {

        if (comando === '0') {
            console.clear()

            console.log('--------Comandos--------');
            console.log("1 - Cardápio\n");
            console.log("2 - Carrinho\n");
            console.log("3 - Finalizar Pedido\n");
            comando = readlineSync.question('Digite o comando: ')
        }
        if (comando === '1') {
            console.clear()
            console.log(`---------*Cardápio*---------`)
            for (let i = 0; i < foods.length; i++) {
                console.log(`1${foods[i].index} - ${foods[i].name}`);
            }
            console.log(`\n`)
            comando = readlineSync.question('Escolha um item do cardapio, ou digite 0 para voltar para os comandos: ')
        }
        if (comando === '2') {
            console.clear()

            console.log(`---------*Carrinho*---------`)
            if (pedidos.length !== 0) {

                console.log('Você ja comprou')
                pedidos = pedidos.filter(item => !!item.name)

                for (let i = 0; i < pedidos.length; i++) {
                    console.log(`${i} - ${pedidos[i].name}`);
                }
                console.log(`\n`)

                valorTotal()

                console.log(`\n`)
                comando = readlineSync.question('Você deseja excluir algum item? Digite 4 para sim. Digite 0 para não: ')
            } else {
                console.log('Você ainda não comprou nada')
                console.log(`\n`)

                comando = readlineSync.question('Digite 0 para listar os comandos, ou 1 para comprar: ')
            }
        }
        if (comando === '3') {
            valorTotal()
            console.log(`\n`)
            break
        }

        if (comando === '5') {
            console.clear()

            console.log(`Qual você quer excluir\n`);

            for (let i = 0; i < pedidos.length; i++) {
                console.log(`${i + 100} - ${pedidos[i].name}`);
            }
            console.log(`\n`)
            comando = readlineSync.question('Qual item você deseja excluir: ')
        }

        if (comando >= 100 && comando < pedidos.length + 100) {
            console.clear()
            console.log(`Item ${pedidos[comando - 100].name} excluído`);
            pedidos.splice(comando - 100, 1)
            console.log("0 - Lista de comandos\n");
            console.log(`\n`)
            comando = readlineSync.question('Digite 0 para listar os comandos: ')
        }

        if ((comando >= 11) && (comando <= foods.length + 10)) {
            console.clear()

            console.log(`Otimo Pedido, um(a) ${foods[comando - 11].name}`)
            pedidos.push(foods[comando - 11])
            console.log("\n");
            comando = readlineSync.question('Digite 0 para listar os comandos, ou 1 para comprar de novo: ')
        }
    }


    const valor_total = pedidos.reduce((total, item) => {
        return total + (item.value);
    }, 0)

    if(valor_total===0){
        client.write('0');
    }else{
        client.write('1');
    }

    client.on("data", function (data) {
        const resposta = data.toString();
        console.log(resposta);
    });

    client.on('end', function() { 
        console.log('Desconectado');
     });
}

client.connect({ port: 3000 }, connectionListener);