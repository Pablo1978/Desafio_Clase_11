import { Router } from "express";
import passport from "passport";

const router = Router()

router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/authFail', failureMessage: true }), async (req, res) => {
    res.status(200).send({ status: "success", payload: req.user._id })
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/authFail', failureMessage: true }), async (req, res) => {

    req.session.user = req.user
    res.send({ status: "success", message: "User logged in" })
})

router.get('/github', passport.authenticate('github'), (req, res) => { })

router.get('/githubcallback', passport.authenticate('github'), (req, res) => {
    req.session.user = req.user
    res.redirect('/')
})

router.get('/authFail', (req, res) => {
    console.log(req.session.messages);
    if (req.session.messages) {
        res.status(401).send({ status: "error", error: req.session.messages[0] })
    } else {
        res.status(401).send({ status: "error", error: "Error de input incompleto para estrategia de passport" })
    }
})

router.get('/logout', async (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.log("Error:", error);
            return res.redirect('/login')
        } else {
            return res.redirect('/login')
        }
    })
})

export default router