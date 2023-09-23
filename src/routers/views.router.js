import { Router } from 'express';
import ProductManager from "../dao/managers/productManagerMongo.js"
const pm = new ProductManager()

const routerV = Router()

routerV.get("/", async (req, res) => {
    const listadeproductos = await pm.getProductsView()
    res.render("home", { listadeproductos })
})

routerV.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts")
})

routerV.get("/chat", (req, res) => {
    res.render("chat")
})

routerV.get('/profile', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login')
        }
        res.render('profile', { user: req.session.user })
    } catch (error) {
        res.json({ error: error });
    }
})

routerV.get('/register', async (req, res) => {

    try {
        res.render('register', {})
    } catch (error) {
        res.json({ error: error });
    }
})

routerV.get('/login', async (req, res) => {

    try {
        res.render('login', {})
    } catch (error) {
        res.json({ error: error });
    }
})

export default routerV