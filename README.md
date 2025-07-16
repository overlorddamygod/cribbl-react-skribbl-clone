# [Cribbl - Drawing Game]()

[Skribbl.io](skribbl.io/) clone with TypeScript <3

## FrontEnd Stack ( /cribbl-client )

- [Reactjs](https://reactjs.org/) - JavaScript library for building user interfaces
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Socket.io Client](https://socket.io/docs/v4/client-api/) - Websocket interface
- [Tailwind css](https://tailwindcss.com/) - CSS toolkit

### Run Frontend
```
cd cribbl-client
```

Copy `.env.sample` as `.env` 

```
npm i
npm run dev
```
Frontend runs on port 3000

## BackEnd Stack ( /cribbl-server )

- [Nodejs](https://nodejs.org/) - JavaScript runtime
- [Nestjs](https://nestjs.com/) - Web Framework
- [Socket.io Server](https://socket.io/docs/v4/server-api/) - Websocket interface

### Run Backend
```
cd cribbl-server
```

Copy `.env.sample` as `.env` 

```
npm i
npx prisma migrate dev --name migration1
npm run start:dev
```
Backend runs on port 3001
