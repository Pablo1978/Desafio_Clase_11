import { Router } from "express";
import jwt from "jsonwebtoken";
import UsersManager from "../../dao/managers/UsersManager.js";
import auth from "../../services/auth.js";
import { validateJWT } from "../../middlewares/validateToken.js";

const router = Router()
const usersService = new UsersManager()

router.post('/loginJWT', async (req, res) => {

    const { email, password } = req.body
    if (!email || !password) return res.status(400).send({ status: "error", message: "Incomplete values" })
    const user = await usersService.getUserById({ email })
    if (!user) return res.status(400).send({ status: "error", message: "Incorrect credentials" })
    const isValidPassword = await auth.validatePassword(password, user.password)
    if (!isValidPassword) return res.status(400).send({ status: "error", message: "Incorrect credentials" })

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.firstName }, 'secretjwtmusicstore', { expiresIn: '1h' })
    res.send({ status: "success", token })

})

router.get('/profileInfo', validateJWT, async (req, res) => {
    console.log(req.user)
    res.send({ status: "success", payload: req.user })
})

export default router