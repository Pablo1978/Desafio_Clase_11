import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import connectToDB from "./config/configServer.js";
import { __dirname } from "./utils.js";
import sessionsRouter from "./routers/sessions.routers.js";
import session from "express-session";
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializeStrategies from "./config/passport.config.js";
import routerP from './routers/products.router.js';
import routerC from './routers/carts.router.js';
import routerV from './routers/views.router.js';
import loginJWTRouter from "./routers/pruebaJWT/loginJWT.js"

import socketProducts from "./listeners/socketProducts.js";
import socketChat from './listeners/socketChat.js';

const app = express();
const PORT = process.env.PORT || 8080

app.use(session({
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://pabloeltano:tier26@cluster0.6a9bfhe.mongodb.net/ecommerce?retryWrites=true&w=majority",
        ttl: 80
    }),
    resave: false,
    saveUninitialized: false,
    secret:"ecommerce"
}))

initializeStrategies()
app.use(passport.initialize())

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine())
app.set('view engine', 'handlebars');
app.set("views", __dirname + "/views")

app.use('/', routerV)
app.use('/api/products', routerP)
app.use('/api/carts', routerC)
app.use('/api/sessions', sessionsRouter)
app.use('/api/sessions', loginJWTRouter)

connectToDB()

const httpServer = app.listen(PORT, () => {
    try {
        console.log(`Listening to the port ${PORT}\nAcceder a:`);
        console.log(`\t1). http://localhost:${PORT}/api/products`);
        console.log(`\t2). http://localhost:${PORT}/api/carts`);
        console.log(`\t3). http://localhost:${PORT}/api/sessions`);
    }
    catch (err) {
        console.log(err);
    }
});

const socketServer = new Server(httpServer)

socketProducts(socketServer)
socketChat(socketServer)