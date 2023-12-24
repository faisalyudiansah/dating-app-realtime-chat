function errorHandler(error, req, res, next) {
    console.log(error)

    let statusCode = 500
    let message = 'Internal Server Error'

    switch (error.name) {
        case 'SequelizeValidationError':
        case 'SequelizeUniqueConstraintError':
            statusCode = 400
            message = error.errors[0].message
            break;
        case 'passwordIsRequired':
            statusCode = 400
            message = 'Password is required'
            break;
        case 'emailIsRequired':
            statusCode = 400
            message = 'Email is required'
            break;
        case 'alreadyAction':
            statusCode = 400
            message = 'You already take an action for this user'
            break;
        case 'chatAlreadyExists':
            statusCode = 400
            message = 'Chat already exists'
            break;
        case 'inputYourText':
            statusCode = 400
            message = 'Input your text message!'
            break;
        case 'userNotExists':
        case 'passwordNotValid':
            statusCode = 401
            message = 'Invalid email or password!'
            break;
        case 'invalidToken':
        case 'JsonWebTokenError':
            statusCode = 401
            message = 'Invalid token'
            break;
        case 'limitedAccess':
            statusCode = 403
            message = 'Free access exhausted. Upgrade to premium for unlimited access'
            break;
        case 'forbiddenAccess':
            statusCode = 403
            message = 'Forbidden Access'
            break;
        case 'notFoundAnyUser':
            statusCode = 404
            message = 'Sorry, no users found at this time'
            break;
        case 'errorNotFound':
            statusCode = 404
            message = 'Error! not found'
            break;
    }

    res.status(statusCode).json({ message })
}

module.exports = errorHandler