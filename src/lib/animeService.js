// Servicio para interactuar con la API no oficial de MyAnimeList (Jikan API)
const BASE_URL = 'https://api.jikan.moe/v4';// La URL de la base del API 

//Creamos una clase llamada AnimeService que puede ser exportada para ser utlizada en cualquier parte de la aplicacion 
export class AnimeService {//export significa que otros archivos pueden usar esta clase 
  //Obtener una lista de los animes mas populares
  static async getPopularAnime(limit = 24) {
    //static = se puede usar sin crear una instancia de la clase 
    //async = la funcion devuelve una promesa
    //limit parametro con valor por defecto 24 
    try {
      //try intenta ejecutar este codigo y si hay un error lo captura en el catch , se va al catch
      const response = await fetch(`${BASE_URL}/top/anime?limit=${limit}`);
      //fetch hace una peticion http a la url del api y devulve una promesa con la respuesta 
      //await espera a que la peticion se complete y devuelve la respuesta
      //limit es el numero de animes a obtener
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);//si la respuesta no es ok , da un error con el estado de la respuesta
      }
      
      const data = await response.json();
      // la API devulve los datos en formato json, por lo que hay que parsearlos con response.json()
      return data.data;//devuelve los datos de la respuesta 
    } catch (error) {//si hay un error en try lo captura aqui
      console.error('Error fetching popular anime:', error);
      throw error;//vuelve a lanzar el error para que pueda ser manejado por quien llame a la funcion
    }
  }

  // Obtener detalles de un anime específico
  static async getAnimeDetails(id) {//id es el identificador de cada anime 
    //static = puede usar sin crear una instancia de la clase 
    try {//try intenta ejecutar este codigo y si hay algun error lo captura en el catch
      const response = await fetch(`${BASE_URL}/anime/${id}`);//hace una peticion http al api con el id del animie 
      //await espera que la peticion se complete y devulve la respuesta
      if (!response.ok) {//si la respuesta no es ok, da un estado de error 
        throw new Error(`Error: ${response.status}`);//lanza un error con el estado de la respuesta
      }
      //si la respuesta es ok parse los datos a json 
      const data = await response.json();//la api devulve los datos en formato json
      return data.data;//devulve los datos de la respuesta 
    } catch (error) {//si hay un error se captura aqui 
      console.error('Error fetching anime details:', error);
      throw error;//vuelve a lanzar el error para que pueda ser manejado por quien llama a la funcion 
    }
  }

  // Obtener videos/trailers de un anime
  static async getAnimeVideos(id) {//id es el identificador del anime 
    //static = puede usar sin necesidad de instanciar la clase
    //async = la funcion devulve una promesa 
    //una promesa es un valor que puede estar disponible ahora, en el futuro o nunca 
    try {//try intenta ejecutar este codigo y si hay algun error lo captura en el catch 
      const response = await fetch(`${BASE_URL}/anime/${id}/videos`);//hace una peticon http al api con el id del anime y  videos 
      //await espera a que la peticion se complete y devulve la respuesta 
      if (!response.ok) {//si la respuesta no es ok , daun estado de error 
        throw new Error(`Error: ${response.status}`);//lanza un error con su estado de respuesta 
      }
      //si la respusta es ok parse a los datos a json 
      const data = await response.json();
      return data.data;//devulve los datos de la respuesta
    } catch (error) {//si hay un error este se captura aqui 
      console.error('Error fetching anime videos:', error);
      throw error;//devuelve el error para que pueda ser manejado por quien llama a la funcion
    }
  }
}