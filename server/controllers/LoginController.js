const { comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const { User, UserProfile } = require('../models');
const { OAuth2Client } = require('google-auth-library');

class LoginController {
    static async register(req, res, next) {
        try {
            const { username, email, password, gender, interest } = req.body
            let data = await User.create({ username, email, password, gender, interest })
            await UserProfile.create({
                fullname: '',
                birthdate: new Date(),
                address: '',
                occupation: '',
                bio: '',
                UserId: data.id,
            })
            res.status(201).json({
                id: data.id,
                username: data.username,
                email: data.email,
            })
        } catch (error) {
            next(error)
        }
    }

    static async login(req, res, next) {
        try {
            let { email, password } = req.body
            if (!password) {
                throw { name: "passwordIsRequired" }
            }
            if (!email) {
                throw { name: "emailIsRequired" }
            }

            let options = {}
            options.where = { email }

            let data = await User.findOne(options)
            if (!data) {
                throw { name: "userNotExists" }
            }

            let checkPassword = comparePassword(password, data.password)
            if (!checkPassword) {
                throw { name: "passwordNotValid" }
            }

            let access_token = signToken(data)
            res.status(200).json({ access_token, username: data.username })
        } catch (error) {
            next(error)
        }
    }

    static async googleLogin(req, res, next) {
        try {
            let token = req.headers['google-token']
            const client = new OAuth2Client();
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            const email = payload['email'];

            let user = await User.findOne({
                where: { email }
            })
            if (!user) {
                user = await User.create({
                    username: payload.name,
                    email: payload.email,
                    password: '12345',
                    gender: 'male',
                    interest: 'female'
                })
                await UserProfile.create({
                    fullname: '',
                    birthdate: new Date(),
                    address: '',
                    profilePicture: payload.picture,
                    occupation: '',
                    bio: '',
                    UserId: user.id,
                })
            }
            let access_token = signToken({ id: user.id })
            res.status(201).json({ access_token, email })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = LoginController