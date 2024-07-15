const fetch = require('node-fetch');  // Importa o módulo node-fetch

async function getAddressFromCEP(cep) {
    const url = `https://cep.awesomeapi.com.br/json/${cep}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Falha ao buscar CEP. Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Erro ao buscar CEP: ${error.message}`);
        return null;
    }
}

// Exemplo de uso
async function main() {
    const cep = '05424020';
    const addressData = await getAddressFromCEP(cep);
    if (addressData) {
        console.log(addressData);
    }
}

main();
