# Trullo

## Teoretisk Genomgång

### Databasval

Jag valt **MongoDB** som databas, och valet baseras på följande faktorer:

1. **Dokumentbaserad**: MongoDB använder ett JSON-liknande format (BSON) för att lagra data, vilket gör det enklare att hantera och strukturera komplexa datamodeller, som uppgifter och projekt i applikationen.

2. **Dynamisk struktur**: En av de största fördelarna med MongoDB är dess stöd för flexibla schemas, vilket innebär att nya fält kan läggas till utan att omforma hela databasschemat. Detta är praktiskt vid snabba ändringar i projektets krav.

3. **Stöd för skalning**: MongoDB är utformat för att hantera stora datavolymer och kan skalas horisontellt med sharding. Detta gör databasen väl lämpad för tillväxtorienterade applikationer.

### Teknikstack

För att bygga och underhålla applikationen används ett antal olika verktyg och npm-paket:

- **Express.js**: Ett ramverk för att skapa webb- och API-applikationer i Node.js. Det underlättar routing och hantering av HTTP-förfrågningar på ett enkelt och effektivt sätt.

- **Mongoose**: Ett Object Data Modeling (ODM) bibliotek för MongoDB, vilket ger en strukturerad och schema-baserad lösning för att hantera datan.

- **jsonwebtoken**: Detta paket används för att skapa och verifiera JSON Web Tokens (JWT), vilket är nödvändigt för autentisering och säkerhet i applikationen.

- **bcrypt**: Används för att hash-a användares lösenord innan de sparas i databasen, vilket säkerställer att känslig information skyddas.

- **mongoose-paginate-v2**: Ett plugin för Mongoose som förenklar implementeringen av paginering vid hämtning av stora dataset från databasen.

### Applikationsfunktioner

Applikationen fungerar som ett verktyg för att hantera uppgifter och projekt, och erbjuder användare flera funktioner för att hantera sin arbetsbelastning:

1. **Registrering och autentisering**: Användare kan skapa ett konto och logga in. Lösenordet skyddas genom att hash-as med bcrypt innan det lagras, och vid inloggning genereras en JWT-token för fortsatt säker autentisering.

2. **Uppgiftshantering (CRUD)**: Användare kan skapa, uppdatera, läsa och radera både uppgifter och projekt. Uppgifterna kan kopplas till projekt och organiseras med hjälp av taggar för bättre översikt.

3. **Paginering och filter**: Användare kan filtrera uppgifter baserat på olika kriterier som status, datum, taggar och projekt. Paginering implementeras för att hantera större datamängder mer effektivt.

4. **Databasinteraktion**: Applikationen använder Mongoose för att kommunicera med MongoDB, vilket gör det smidigt att hantera datamodeller och frågor mot databasen.

5. **Säkerhet**: JWT-baserad autentisering skyddar applikationens API:er och ser till att endast behöriga användare får utföra specifika åtgärder.

## Användning

### Installation

1. Klona repositoryt:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Installera beroenden:
    ```sh
    npm install
    ```

### Konfiguration

1. Skapa en `.env`-fil i projektets rotkatalog och lägg till följande miljövariabler:
    ```env
    PORT=3000
    MONGODB_URI=<din-mongodb-uri>
    JWT_SECRET=<ditt-jwt-hemliga-nyckel>
    ```

### Körning

1. Starta utvecklingsservern:
    ```sh
    npm run dev
    ```

2. Bygg och starta produktion:
    ```sh
    npm run build
    npm start
    ```

### Testning

1. Kör enhetstester:
    ```sh
    npm test
    ```

2. Kör API-tester:
    ```sh
    node test-api.mjs
    ```


## API-dokumentation

### Autentisering

- **POST /api/users/register**
  - Registrerar en ny användare.
  - Body:
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```

- **POST /api/users/login**
  - Loggar in en användare och returnerar en JWT-token.
  - Body:
    ```json
    {
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```

### Uppgifter

- **GET /api/tasks**
  - Hämtar alla uppgifter.
  - Headers:
    ```json
    {
      "Authorization": "Bearer <JWT-token>"
    }
    ```

- **POST /api/tasks**
  - Skapar en ny uppgift.
  - Body:
    ```json
    {
      "title": "Ny uppgift",
      "description": "Beskrivning av uppgiften",
      "status": "To Do",
      "assignedTo": "<user-id>"
    }
    ```


## Licens

Detta projekt är licensierat under MIT-licensen. Se [LICENSE](LICENSE) för mer information.