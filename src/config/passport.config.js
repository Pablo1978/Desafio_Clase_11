import passport from "passport"
import local from "passport-local"
import GithubStrategy from "passport-github2"
import UsersManager from "../dao/managers/UsersManager.js"
import authService from "../services/auth.js"

const LocalStrategy = local.Strategy

const usersService = new UsersManager()

const initializeStrategies = () => {

    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, email, password, done) => {

        const {
            firstName,
            lastName,
            age,
        } = req.body

        if (!firstName || !lastName || !email || !age || !password) return done(null, false, { message: "Incomplete values" })

        const hashPassword = await authService.createHash(password)

        const newUser = {
            firstName,
            lastName,
            email,
            age,
            password: hashPassword
        }

        const result = await usersService.createUser(newUser)
        done(null, result)
    }))

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        if (!email || !password) return done(null, false, { message: "Incomplete values" })

        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {

            const adminUser = {
                _id: "admin-id",
                firstName: "Admin",
                lastName: "Admin",
                email: "adminCoder@coder.com",
                role: "admin"
            }
            return done(null, adminUser)
        }

        const user = await usersService.getUserById({ email })
        if (!user) return done(null, false, { message: "Incorrect credentials" })

        const isValidPassword = await authService.validatePassword(password, user.password)
        if (!isValidPassword) return done(null, false, { message: "Incorrect credentials" })

        done(null, user)
    }))
}

passport.use('github', new GithubStrategy({
    clientID: 'Iv1.ecdb7f8e547fc390',
    clientSecret: 'f5d78b25b4dec3d19483c80c85260cd0b7fdfe85',
    callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
}, async (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    const { email, name } = profile._json

    const user = await usersService.getUserById({ email })
    if (!user) {
        const newUser = {
            firstName: name,
            email,
            password: ''
        }

        const result = await usersService.createUser(newUser)
        done(null, result)
    } else {
        done(null, user)
    }
}))

passport.serializeUser((user, done) => {
    return done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    const user = await usersService.getUserById({
        _id: id
    })
    done(null, user)
})

export default initializeStrategies