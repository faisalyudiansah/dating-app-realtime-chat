const { User, UserProfile, Connection } = require('../models')
const Sequelize = require('sequelize')
const { Op } = require("sequelize")

class UserController {
    static async showAllUser(req, res, next) {
        try {
            let loggedInUserId = req.user.id
            let loggedInUser = await User.findByPk(loggedInUserId)

            let options = {
                include: {
                    model: UserProfile,
                },
                where: {
                    show: true,
                    gender: loggedInUser.interest === 'male' ? 'male' : 'female',
                },
                attributes: {
                    exclude: ['subscription', 'remainingLikes', 'password', 'show'],
                },
            }

            if (loggedInUser.gender === loggedInUser.interest) {    // if gender === interest, user login not show
                options.where.id = { [Sequelize.Op.ne]: loggedInUserId }
            }

            let totalData = await User.findAll({
                where: options.where,
            })

            let data = await User.findAll(options)
            if (data.length <= 0) {
                throw { name: 'notFoundAnyUser' }
            }

            res.status(200).json({
                message: 'Successfully Received Data',
                totalData: totalData.length,
                data,
            })
        } catch (error) {
            next(error)
        }
    }

    static async userProfile(req, res, next) {
        try {
            let data = await User.findByPk(req.user.id, {
                include: {
                    model: UserProfile,
                },
                attributes: {
                    exclude: ['password'],
                },
            })
            if (!data) {
                throw { name: 'errorNotFound' }
            }

            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }

    static async updateUser(req, res, next) {
        try {
            let data = await User.findByPk(req.user.id, {
                include: {
                    model: UserProfile,
                },
                attributes: {
                    exclude: ['password'],
                },
            })
            if (!data) {
                throw { name: "errorNotFound" }
            } else {
                const { username, email, gender, interest, show, fullname, birthdate, profilePicture, address, occupation, bio } = req.body
                await data.update({ username, email, gender, interest, show })
                await UserProfile.update({ fullname, birthdate, profilePicture, address, occupation, bio }, {
                    where: {
                        UserId: req.user.id
                    }
                })
                res.status(200).json({ message: 'Data user success to update' })
            }
        } catch (error) {
            next(error)
        }
    }

    static async deleteUser(req, res, next) {
        try {
            let data = await User.findByPk(req.user.id, {
                include: {
                    model: UserProfile,
                },
                attributes: {
                    exclude: ['password'],
                },
            })
            if (!data) {
                throw { name: "errorNotFound" }
            } else {
                await data.destroy()
                res.status(200).json({ message: `Account success to delete` })
            }
        } catch (error) {
            next(error)
        }
    }

    static async likeUser(req, res, next) {
        try {
            let data = await User.findByPk(req.user.id)
            if (!data) {
                throw { name: "errorNotFound" }
            }
            let targetLikeUser = await User.findByPk(req.params.idUser)
            if (!targetLikeUser) {
                throw { name: "errorNotFound" }
            }
            let existingConnection = await Connection.findOne({
                where: {
                    UserIdA: req.user.id,
                    UserIdB: req.params.idUser,
                },
            })
            if (existingConnection) {
                throw { name: "alreadyAction" }
            }

            if (data.subscription === false) {
                if (data.remainingLikes > 0) {
                    await data.decrement('remainingLikes')
                    await Connection.create({
                        UserIdA: req.user.id,
                        UserIdB: req.params.idUser,
                        status: 'liked',
                    })
                    return res.status(200).json({ message: 'Liked user successfully' })
                }
                if (data.remainingLikes === 0) {
                    throw { name: "limitedAccess" }
                }
            } else {
                await Connection.create({
                    UserIdA: req.user.id,
                    UserIdB: req.params.idUser,
                    status: 'liked',
                })
                return res.status(200).json({ message: 'Liked user successfully' })
            }
        } catch (error) {
            next(error)
        }
    }

    static async dislikeUser(req, res, next) {
        try {
            let data = await User.findByPk(req.user.id)
            if (!data) {
                throw { name: "errorNotFound" }
            }
            let targetLikeUser = await User.findByPk(req.params.idUser)
            if (!targetLikeUser) {
                throw { name: "errorNotFound" }
            }
            let existingConnection = await Connection.findOne({
                where: {
                    UserIdA: req.user.id,
                    UserIdB: req.params.idUser,
                },
            })
            if (existingConnection) {
                throw { name: "alreadyAction" }
            }

            if (data.subscription === false) {
                if (data.remainingLikes > 0) {
                    await data.decrement('remainingLikes')
                    await Connection.create({
                        UserIdA: req.user.id,
                        UserIdB: req.params.idUser,
                        status: 'disliked',
                    })
                    return res.status(200).json({ message: 'Disliked user successfully' })
                }
                if (data.remainingLikes === 0) {
                    throw { name: "limitedAccess" }
                }
            } else {
                await Connection.create({
                    UserIdA: req.user.id,
                    UserIdB: req.params.idUser,
                    status: 'disliked',
                })
                return res.status(200).json({ message: 'Disliked user successfully' })
            }
        } catch (error) {
            next(error)
        }
    }

    static async matchesLike(req, res, next) {
        try {
            const loggedInUserId = req.user.id
            // Query untuk mencari pengguna yang menyukai pengguna yang sedang login
            const likedUsers = await Connection.findAll({
                where: {
                    UserIdA: loggedInUserId,
                    status: 'liked',
                },
            })
            // Query untuk mencari pengguna yang disukai oleh pengguna yang sedang login
            const likedBackUsers = await Connection.findAll({
                where: {
                    UserIdB: loggedInUserId,
                    status: 'liked',
                },
            })
            // Filter hanya pengguna yang menyukai balik
            const matchedUsers = likedUsers.filter((userA) =>
                likedBackUsers.some((userB) => userA.UserIdB === userB.UserIdA)
            )
            // Jika tidak ada pengguna yang sesuai, berikan respons khusus
            if (matchedUsers.length === 0) {
                throw { name: "notFoundAnyUser" }
            }
            // Ambil informasi pengguna yang saling menyukai atau menyukai balik
            const matchedUserIds = matchedUsers.map((user) => user.UserIdB)
            // Query untuk mendapatkan informasi lengkap dari pengguna yang saling menyukai
            const matchedUserDetails = await User.findAll({
                where: {
                    id: matchedUserIds,
                },
                include: {
                    model: UserProfile,
                },
                attributes: {
                    exclude: ['subscription', 'remainingLikes', 'password', 'show'],
                },
            })
            res.status(200).json({
                message: 'Successfully Received Data',
                data: matchedUserDetails,
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController