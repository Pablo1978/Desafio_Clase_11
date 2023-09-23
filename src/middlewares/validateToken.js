import jwt from "jsonwebtoken"

export const validateJWT = (req, res, next) => {

    try {
        const authHeader = req.headers.authorization
        if (!authHeader) return res.status(401).send({ status: "error", message: "User not loggeed" })
        const token = authHeader.split(' ')[1]
        const userInfo = jwt.verify(token, 'secretjwtmusicstore')
        req.user = userInfo
        next()
    } catch (error) {
        console.log(error)
        res.status(401).send({ status: "error", error: error })
    }
}