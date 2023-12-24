const { User, UserProfile } = require('../models');

async function authorizationOwner(req, res, next) {
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
        }
        if (req.user.id !== data.UserProfile.UserId) {
            throw { name: 'forbiddenAccess' }
        }
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = authorizationOwner