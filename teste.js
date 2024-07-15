// const { Client } = require('@googlemaps/google-maps-services-js');


async function obterRuaBairroEstadoDeCep(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        // console.log(data)
        if (data.erro) {
            return 'CEP não encontrado';
        } else {
            return `${data.logradouro}, ${data.bairro}, ${data.localidade}/${data.uf}`;
        }
    } catch (error) {
        console.error('Erro ao obter localidade:', error);
        return 'Erro ao buscar CEP';
    }
}

async function obterCoordenadas(cep) {
    try {
        // Passo 1: Obter a localidade a partir do CEP
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            return 'CEP não encontrado';
        } else {
            const localidade = `${data.localidade}/${data.uf}`;
            
            // Passo 2: Consultar geocodificação reversa para obter lat/long
            const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${localidade}&key=YOUR_GOOGLE_MAPS_API_KEY`);
            const geocodeData = await geocodeResponse.json();
            
            if (geocodeData.results && geocodeData.results.length > 0) {
                const location = geocodeData.results[0].geometry.location;
                return {
                    lat: location.lat,
                    lng: location.lng
                };
            } else {
                return 'Localidade não encontrada';
            }
        }
    } catch (error) {
        console.error('Erro ao obter coordenadas:', error);
        return 'Erro ao buscar coordenadas';
    }
}


async function getLatLng(address) {
    const client = new Client({});
    try {
      const response = await client.geocode({
        params: {
          address: address,
          key: 'YOUR_API_KEY', // Substitua pelo seu API key do Google Maps
        },
      });
  
      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    } catch (error) {
      console.error('Erro ao obter localização:', error.response.data.error_message);
      return null;
    }
  }
// Exemplo de uso:

// Exemplo de uso:
const cep = '58070-470'; // Substitua pelo CEP desejado

obterRuaBairroEstadoDeCep(cep)
    .then(localidade => console.log('Localidade:', localidade));
