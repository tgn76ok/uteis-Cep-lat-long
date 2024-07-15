import pandas as pd
import brazilcep
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter
import time

def fetch_geocoded_addresses(df):
    # Função para transformar o CEP em um endereço com tratamento de retry
    def get_address_with_retry(cep):
        max_retries = 3  # Número máximo de tentativas
        current_retry = 0
        while current_retry < max_retries:
            try:
                endereco = brazilcep.get_address_from_cep(cep)
                print(endereco)
                return endereco['street'] + ", " + endereco['district'] + ", " + endereco['city'] + " - " + endereco['uf']
            except brazilcep.exceptions.BrazilCEPException as e:
                if "429" in str(e):  # Verifica se o erro é relacionado a limite de taxa
                    wait_time = 2 ** current_retry  # Exponential backoff
                    print(f"Rate limit exceeded. Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                    current_retry += 1
                else:
                    raise e  # Rethrow exception if not rate limit issue

        raise Exception(f"Failed after {max_retries} retries. Check CEP or try again later.")

    # Troque test_app pelo nome da sua aplicação/sistema
    geolocator = Nominatim(user_agent="test_app")
    geocode = RateLimiter(geolocator.geocode, min_delay_seconds=1)

    # Cria a coluna address com os endereços retornados a partir do CEP
    df['address'] = df['CEP'].apply(get_address_with_retry)

    # Cria a coluna location com o local retornado a partir do endereço
    df['location'] = df['address'].apply(geocode)

    # Seleciona a latitude e longitude que está dentro do local
    df['point'] = df['location'].apply(lambda loc: tuple(loc.point) if loc else None)

    return df

# Exemplo de uso da função
def main():
    # DataFrame de teste
    df = pd.DataFrame({'CEP': ['58070470']})

    # Chama a função para buscar os endereços geocodificados
    df_geocoded = fetch_geocoded_addresses(df)

    print(df_geocoded)

if __name__ == "__main__":
    main()
    
# Função para transformar o CEP em um endereço 
def get_address(cep):
    endereco = brazilcep.get_address_from_cep(cep)
    print(endereco)
    return endereco['street'] + ", " + endereco['district'] + ", " + endereco['city'] + " - " + endereco['uf']
