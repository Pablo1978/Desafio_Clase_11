import usersModel from "../models/users.js";

export default class UsersManager {

    getUsers = () => {
        return usersModel.find().lean()
    }

    getUserById = (id) => {
        return usersModel.findOne(id).lean()
    }

    createUser = (user) => {
        return usersModel.create(user)
    }
}