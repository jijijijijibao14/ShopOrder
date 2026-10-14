# Order and Product Management

## Authentication setup

The application stores users in MongoDB. User passwords are hashed with bcrypt, and sessions are stored in MongoDB.

1. Copy `.env.example` to `.env` (or add its variables to your existing `.env`).
2. Set `MONGO_URI` and a long, random `SESSION_SECRET`.
3. Set `CUSTOMER_USERNAME` and `CUSTOMER_PASSWORD`, then `SALER_USERNAME` and `SALER_PASSWORD`.
   - Usernames must contain at least 7 ASCII letters or digits, with no spaces or symbols.
   - Passwords must be at least 8 characters and include a lowercase letter, an uppercase letter, and a number.
4. Create or update both accounts in MongoDB:

   ```sh
   npm run seed:users
   ```

5. Start the application with `npm start` and open `http://localhost:3000/login`.

The login page asks only for a username and password. Each account has a fixed role assigned when the seed script creates it: the Customer account is redirected to orders, and the Saler account is redirected to products. Users cannot choose or change their role on the login page. Requests to the other role's routes are rejected by the server.

Saler users can create, edit, and delete products from the product list. Order dates must be today or a future date; this is checked both in the order forms and on the server when creating or updating an order.
