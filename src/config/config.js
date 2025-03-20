//Importar dotenv
import dotenv from 'dotenv';
dotenv.config();


export const config = {
    PORT:  process.env.PORT ?? 8080,
    URL_MONGODB: process.env.URL_MONGODB
}
