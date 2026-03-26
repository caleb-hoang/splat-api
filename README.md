# splat-api
A RESTful API containing information about collectibles, weapons, and other miscellaneous data for the video game Splatoon 3.
Utilizes data mined and sourced from [leanny.github.io](https://leanny.github.io/)

## How to run
- Download repository
- Run `node ./database/initialize-database.js`
- Run `node ./database/populate-database.js`
- Run node app.js
- Access the API from http://localhost:3000/api/

## Routes

### Brands
- `GET /api/brands` - Returns all brands
- `GET /api/brands/:name` - Returns a specific brand by name or internal ID

### Abilities
- `GET /api/abilities` - Returns all abilities
- `GET /api/abilities/:name` - Returns a specific ability by name or internal identifier