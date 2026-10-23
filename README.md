# Bangla News 24

Bangla News 24 is a Bengali news site built with Next.js. It brings news sections, article pages, and account features together in one place. Visitors can create an account with email and password, or sign in with Google or GitHub when those providers are configured.

## Run it locally

You’ll need Node.js and npm. Clone the repository, install the packages, and start the development server:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create a `.env.local` file in the project root. Add your MongoDB connection string and Better Auth settings:

```env
MONGODB_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
```

`BETTER_AUTH_SECRET` should be a long, random secret. Keep `.env.local` private and never commit it.

Google and GitHub sign-in are optional. To enable either provider, add its client ID and client secret:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

The app also accepts `MONGODB_DNS_SERVER` if your network needs a custom DNS resolver. You can leave it unset otherwise.

## Useful commands

```bash
npm run dev    # Start the local development server
npm run build  # Create a production build
npm run start  # Run the production build
npm run lint   # Check the code with ESLint
```

## Tech stack

- Next.js and React
- TypeScript
- MongoDB with Better Auth
- Tailwind CSS and DaisyUI
