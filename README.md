# Travlr Getaways (CS 465 Full Stack Development)

A full stack travel booking app built on the MEAN stack (MongoDB, Express, Angular and Node.js) for the fictional client Travlr Getaways. It has two sides that share one API and one database:

- **Customer site:** an Express app with Handlebars templates where travelers browse trips.
- **Admin site:** an Angular single-page application (SPA) where logged in admins add, edit and delete trips.

## Tech Stack

| Layer | Tools |
| --- | --- |
| Customer front end | Express, Handlebars (hbs), HTML, CSS |
| Admin front end | Angular 20, TypeScript, Bootstrap 5 |
| API | Express REST API (`app_api`) |
| Database | MongoDB with Mongoose |
| Security | Passport (local strategy), pbkdf2 salted password hashes, JSON Web Tokens |
| Testing | Jasmine and Karma (Angular), PowerShell `Invoke-RestMethod` / Postman (API) |

## Project Structure

```
app.js                  Express setup, CORS, Passport
app_server/             Customer site: routes, controllers, Handlebars views
app_api/
  config/passport.js    Login check (email + password)
  controllers/          trips.js (CRUD) and authentication.js (register, login)
  models/               travlr.js (Trip schema), user.js (User schema), db.js
  routes/index.js       API routes, JWT check on POST/PUT/DELETE
data/trips.json         Seed data
travlr-admin/           Angular admin SPA
```

## Running It Locally

1. Make sure MongoDB is running on `mongodb://127.0.0.1`.
2. In the main folder run `npm install`.
3. Create a `.env` file in the main folder with `JWT_SECRET=` followed by any long random string.
4. Load the trips: `node app_server/models/seed.js`
5. Start the server: `npm start` (customer site at http://localhost:3000/travel)
6. Create an admin user by sending a POST to `http://localhost:3000/api/register` with JSON: `{ "name": "Admin", "email": "admin@travlr.com", "password": "your-password" }`
7. In `travlr-admin` run `npm install`, then `ng serve` (admin site at http://localhost:4200)
8. Run the Angular tests with `ng test --watch=false`

## API Endpoints

| Method | URL | What it does | Needs login? |
| --- | --- | --- | --- |
| GET | `/api/trips` | List all trips | No |
| GET | `/api/trips/:tripCode` | Get one trip | No |
| POST | `/api/trips` | Add a trip | Yes |
| PUT | `/api/trips/:tripCode` | Update a trip | Yes |
| DELETE | `/api/trips/:tripCode` | Delete a trip | Yes |
| POST | `/api/register` | Create an admin user | No |
| POST | `/api/login` | Log in and get a token | No |

Protected routes need the header `Authorization: Bearer <token>`.

---

# Module Eight Journal

## Architecture

**Compare and contrast the types of front end development you used in your full stack project, including Express HTML, JavaScript, and the single-page application (SPA).**

I used three kinds of front end work in this project. It started as a plain static HTML site with some JavaScript, where every page was its own hard coded file. Then I moved it into Express with Handlebars templates. That turned the static pages into templates the server fills in with trip data, so the trips page got built from whatever was in the database instead of being typed out by hand. Every click still means the server builds a whole new page and sends it back, but that's fine for a customer site where people are mostly just reading.

The admin side is an Angular SPA, and it works really differently. The server sends the app once, and after that Angular swaps components in and out in the browser and talks to the API in the background. When an admin adds or edits a trip, only the part of the page that changed gets redrawn. It's more setup (the CLI, TypeScript, components, services, routing), but it feels a lot faster and more like a real app, which makes sense for people who are editing data all day.

**Why did the backend use a NoSQL MongoDB database?**

MongoDB stores data as JSON style documents, which lines up with everything else in the stack. The trip data starts as JSON in `trips.json`, Mongoose turns it into documents, the API sends it out as JSON, and Angular and Handlebars both read it as JSON. There's no translating between tables and objects along the way. It's also flexible. If Travlr wants to add flights, hotels or cruises later (like the class diagram shows), the schema can grow without redoing a bunch of tables. Mongoose still lets me add structure with schemas and required fields, so I get some of the rules a SQL database would give me without losing that flexibility.

## Functionality

**How is JSON different from JavaScript and how does JSON tie together the frontend and backend development pieces?**

JavaScript is a programming language. JSON is just a text format for data that borrows JavaScript's object syntax. JSON can't hold functions or logic, only data like strings, numbers, booleans, arrays and objects, and the keys have to be in double quotes. That's what makes it work as a common language between the pieces. The database stores documents shaped like JSON, the Express API sends JSON back with `res.json()`, the Angular service receives JSON and turns it into Trip objects, and the forms send JSON back when you add or update a trip. Even the login tokens are JSON inside, since a JWT's middle section is a JSON payload with the user's email, name and expiration time.

**Provide instances in the full stack process when you refactored code to improve functionality and efficiencies, and name the benefits that come from reusable user interface (UI) components.**

- **Static HTML to Handlebars templates:** I pulled the repeated header and footer into partials and turned the trips page into a template that loops over data. One change to a partial updates every page.
- **Hard coded data to the API:** The customer site first read trips from a JSON file. I refactored the travel controller to fetch from `/api/trips` instead, so both sites use one source of truth.
- **Separating `app_api` from `app_server`:** Moving the database models and API into their own folder kept the customer site from talking to the database directly.
- **Trip card component:** In Angular I pulled the trip display out of the list into its own trip card component. The list just loops and drops in a card for each trip.
- **Security refactor:** Adding login meant changing both sides. On the API I put a JWT check in front of POST, PUT and DELETE. In Angular I added an interceptor that attaches the token to every request automatically, instead of adding headers by hand in each service call.

Reusable components save a lot of time. I write the trip card once and it works for 3 trips or 300. If I change the layout, it changes everywhere. Components are also easier to test on their own, and bugs stay in one place instead of being copied all over the app.

## Testing

**Methods for request and retrieval necessitate various types of API testing of endpoints, in addition to the difficulties of testing with added layers of security. Explain your understanding of methods, endpoints, and security in a full stack application.**

An endpoint is a URL the API listens on, like `/api/trips` or `/api/trips/:tripCode`. The method says what you want to do there. GET reads data, POST adds something new, PUT updates something that exists, and DELETE removes it. The same URL can do different things depending on the method, so each method and endpoint combo needs its own test. I tested both the happy path (the right data comes back with a 200 or 201) and the failure cases, like asking for a trip code that doesn't exist and getting a 404.

Security made testing harder, in a good way. Once login was added, POST, PUT and DELETE need a valid token, so every test had to cover both sides. With a good token the request should work, and with no token, a fake token or an expired token it should get a 401 and never touch the database. To test those by hand I had to register a user, log in, grab the token and put it in the `Authorization: Bearer` header myself. Postman wouldn't open on my machine, so I did all of this with PowerShell's `Invoke-RestMethod`, which sends the same requests.

On the Angular side I wrote 22 automated tests with mock data. Angular's HttpTestingController stands in for the real API, and a fake local storage stands in for the browser. That let me test things like "does the interceptor add the token," "does an expired token count as logged out," and "are the Edit and Delete buttons hidden when you're logged out" without needing the server running. Then I tested the whole thing by hand in the browser, logged out and logged in, to make sure it all worked together.

## Reflection

**How has this course helped you in reaching your professional goals? What skills have you learned, developed, or mastered in this course to help you become a more marketable candidate in your career field?**

I'm working on moving from line cook into software engineering, and this course gave me my first real full stack project from start to finish. Before this I'd mostly written code that ran by itself. Here I had to make a database, an API, two front ends and a login system all work together, which is a lot closer to what a real job looks like.

The skills I'm taking away:

- Building a REST API with Express and connecting it to MongoDB with Mongoose
- Building an Angular SPA with components, services, routing and forms
- Adding real security: salted password hashing, JWT login, protected routes and route guards
- Testing at every layer, from API requests to automated Angular tests with mock data
- Using Git the way teams do, with a branch for each stage of the project
- Writing a software design document that explains the architecture to someone else
- Debugging real problems, like a stopped MongoDB service, CORS errors and work that never got committed

This repo is something I can show employers to prove I can build and secure a working full stack app, not just talk about one.

---

**AI usage acknowledgment:** I used Claude (Anthropic) to help me build, test and understand this project and to help write this README. I followed the SNHU Shapiro Library guidelines for acknowledging AI use.
