# X-Clone
<img src="https://github.com/Akash1000x/X-Clone/assets/113286019/5e8e5c55-93e6-461c-b913-7c978939a385" alt="Image"  height="500">


## Technologies Used

- [GraphQL](https://graphql.org/)
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [NextJs](https://nextjs.org/)
- [Redis](https://redis.io/)
- [Tanstack](https://tanstack.com/)
- PostgreSQL
- Google Auth
- Tailwindcss
- TypeScript
- jwt
- Amazon S3 for photos upload

## Setup

1. Clone the repository:

   ```bash
     git clone https://github.com/Akash1000x/X-Clone.git

2. nstall dependencies for both Frontend and Backend using Yarn::
    ```bash
      yarn
     ```
3. Add PostgreSQL database URL and JWT secret to the Backend's .env file.
  
5. Generate Prisma Client by running the following commands on the Backend::
    ```bash
    npx prisma migrate dev
    npx generate client
    ```
6. Add a .env file to the Frontend for the Google Client ID.

7. Run the development command on both Backend and Frontend:
    ```bash
    yarn dev
    ```
8. Open the Clone in your web browser:
     http://localhost:3000/home

## Contributing
  Feel free to contribute to the project. If you have suggestions or find any issues, please open an issue.
