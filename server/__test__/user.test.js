const request = require('supertest')
const { app } = require('../app')
const { User, UserProfile, Connection } = require('../models')
const { signToken } = require('../helpers/jwt')
const fs = require('fs')

let accessTokenUser1
let accessTokenUser2
let accessTokenUser3
let accessTokenUser6
let accessTokenUser7
let accessTokenUser8
let accessTokenUser9
beforeAll(async () => {
    await User.bulkCreate(require('../data/users.json'))
    await UserProfile.bulkCreate(require('../data/userprofiles.json'))

    let user1 = await User.create({
        username: "marcelo",
        email: "marcelo@gmail.com",
        password: "12345",
        gender: "male",
        interest: "female"
    })
    accessTokenUser1 = signToken(user1)
    await UserProfile.create({
        fullname: 'Marcelo Vieira',
        birthdate: '1998-03-05',
        profilePicture: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg',
        address: 'Brazil',
        occupation: 'Technician',
        bio: 'I am a father with 2 wife and im looking for another wife',
        UserId: user1.id,
    })

    let user2 = await User.create({
        username: "isabella",
        email: "isabella@gmail.com",
        password: "12345",
        gender: "female",
        interest: "male"
    })
    accessTokenUser2 = signToken(user2)
    await UserProfile.create({
        fullname: 'Isabella Laraswati',
        birthdate: '1990-03-05',
        profilePicture: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg',
        address: 'Portugal',
        occupation: 'Singer',
        bio: 'please reach me! i wanna have another husbanddddd',
        UserId: user2.id,
    })

    let user3 = await User.create({
        username: "zidane",
        email: "zidane@gmail.com",
        password: "12345",
        gender: "male",
        interest: "female"
    })
    accessTokenUser3 = signToken(user3)
    await UserProfile.create({
        fullname: 'Zinedine Zidane',
        birthdate: '1978-03-05',
        profilePicture: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg',
        address: 'France',
        occupation: 'Barber Shop',
        bio: 'I need a mother for my son',
        UserId: user3.id,
    })
    let user4 = await User.create({
        username: "fufu",
        email: "fufu@gmail.com",
        password: "12345",
        gender: "male",
        interest: "female"
    })
    accessTokenUser6 = signToken(user4)
    await UserProfile.create({
        fullname: 'fufufufufu',
        birthdate: '1985-10-05',
        profilePicture: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg',
        address: 'Spain',
        occupation: 'Data Engineering',
        bio: 'Need a girlfriend ASAP!',
        UserId: user4.id,
    })

    let user5 = await User.create({
        username: "fffff",
        email: "fffff@gmail.com",
        password: "12345",
        gender: "female",
        interest: "male"
    })
    accessTokenUser7 = signToken(user5)
    await UserProfile.create({
        fullname: 'ffffff',
        birthdate: '1990-01-01',
        profilePicture: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg',
        address: 'Los Angles, US',
        occupation: 'Teacher',
        bio: 'Need a boyfriend ASAP!',
        UserId: user5.id,
    })

    let user6 = await User.create({
        username: "qwee",
        email: "qwee@gmail.com",
        password: "12345",
        gender: "female",
        interest: "male"
    })
    accessTokenUser8 = signToken(user6)
    await UserProfile.create({
        fullname: 'qwe',
        birthdate: '1990-01-01',
        profilePicture: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg',
        address: 'Los Angles, US',
        occupation: 'Teacher',
        bio: 'Need a boyfriend ASAP!',
        UserId: user5.id,
    })

    let user7 = await User.create({
        username: "RRRRRR",
        email: "RRRRRR@gmail.com",
        password: "12345",
        gender: "female",
        interest: "male"
    })
    accessTokenUser9 = signToken(user7)
    await UserProfile.create({
        fullname: 'FFFEERRR',
        birthdate: '1990-01-01',
        profilePicture: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg',
        address: 'Los Angles, US',
        occupation: 'Teacher',
        bio: 'Need a boyfriend ASAP!',
        UserId: user5.id,
    })
})

afterAll(async () => {
    await User.destroy({
        truncate: true,
        restartIdentity: true,
        cascade: true
    })
    await UserProfile.destroy({
        truncate: true,
        restartIdentity: true,
        cascade: true
    })
    await Connection.destroy({
        truncate: true,
        restartIdentity: true,
        cascade: true
    })
})

describe('GET /', () => {
    test('TESTING HOME', async () => {
        const response = await request(app)
            .get('/')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('message', "Server-side RESTful API Dating App is Running...")
    })
})

describe('GET /users', () => {
    test('INTEREST : FEMALE. SHOW USERS THAT LOOKING FOR PARTNER', async () => {
        const response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${accessTokenUser1}`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('message', expect.any(String))
        expect(response.body).toHaveProperty('totalData', expect.any(Number))
        expect(response.body.data).toBeInstanceOf(Array)
        expect(response.body.data[0]).toBeInstanceOf(Object)
        expect(response.body.data[0]).toHaveProperty('gender', "female")
        expect(response.body.data[0].UserProfile).toBeInstanceOf(Object)
    })

    test('INTEREST : MALE. SHOW USERS THAT LOOKING FOR PARTNER', async () => {
        const response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${accessTokenUser2}`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('message', expect.any(String))
        expect(response.body).toHaveProperty('totalData', expect.any(Number))
        expect(response.body.data).toBeInstanceOf(Array)
        expect(response.body.data[0]).toBeInstanceOf(Object)
        expect(response.body.data[0]).toHaveProperty('gender', "male")
        expect(response.body.data[0].UserProfile).toBeInstanceOf(Object)
    })

    test('USER WAS NOT LOGGED IN', async () => {
        const response = await request(app)
            .get('/users')
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('INVALID TOKEN', async () => {
        const response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })


    test('NOT BEARER AUTHEN', async () => {
        const response = await request(app)
            .get('/users')
            .set('Authorization', `NotBearer ${accessTokenUser3}`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })
})

describe('GET /users/profile', () => {
    test('GET USER PROFILE WHO IS CURRENTLY LOGGED IN', async () => {
        const response = await request(app)
            .get('/users/profile')
            .set('Authorization', `Bearer ${accessTokenUser1}`)
        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('username')
        expect(response.body).toHaveProperty('email')
        expect(response.body).toHaveProperty('UserProfile')
        expect(response.body.UserProfile).toBeInstanceOf(Object)
        expect(response.body.UserProfile).toHaveProperty('fullname')
        expect(response.body.UserProfile).toHaveProperty('birthdate')
        expect(response.body.UserProfile).toHaveProperty('profilePicture')
        expect(response.body.UserProfile).toHaveProperty('UserId', expect.any(Number))
    })

    test('USER WAS NOT LOGGED IN', async () => {
        const response = await request(app)
            .get('/users/profile')
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('INVALID TOKEN', async () => {
        const response = await request(app)
            .get('/users/profile')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('NOT BEARER AUTHEN', async () => {
        const response = await request(app)
            .get('/users/profile')
            .set('Authorization', `NotBearer ${accessTokenUser3}`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })
})

describe('PUT /users', () => {
    test('SUCCESS EDIT USER ACCOUNT AND USER PROFILE', async () => {
        let dataBody = {
            username: "marcelo",
            email: "marcelo@gmail.com",
            gender: "male",
            interest: "female",
            show: false,
            fullname: "Marcelo Vieira",
            birthdate: "1996-12-13",
            profilePicture: "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg",
            address: "Brazil",
            occupation: "Technician",
            bio: "I'm one of the best of Technician from Brazil"
        }
        const response = await request(app)
            .put('/users')
            .send(dataBody)
            .set('Authorization', `Bearer ${accessTokenUser1}`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('message', "Data user success to update")
    })

    test('USER WAS NOT LOGGED IN', async () => {
        const response = await request(app)
            .put('/users')
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('INVALID TOKEN', async () => {
        const response = await request(app)
            .put('/users')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('NOT BEARER AUTHEN', async () => {
        const response = await request(app)
            .put('/users')
            .set('Authorization', `NotBearer ${accessTokenUser3}`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })
})

describe('DELETE /users', () => {
    test('SUCCESS DELETE ACCOUNT', async () => {
        const response = await request(app)
            .delete('/users')
            .set('Authorization', `Bearer ${accessTokenUser1}`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('message', "Account success to delete")
    })

    test('USER WAS NOT LOGGED IN', async () => {
        const response = await request(app)
            .delete('/users')
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('INVALID TOKEN', async () => {
        const response = await request(app)
            .delete('/users')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('NOT BEARER AUTHEN', async () => {
        const response = await request(app)
            .delete('/users')
            .set('Authorization', `NotBearer ${accessTokenUser3}`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })
})

describe('POST /users/like/:idUser', () => {
    test('SUCCESS GIVE A LIKE TO ANOTHER USER', async () => {
        await User.update({ remainingLikes: 1 }, {
            where: {
                id: 12
            }
        })
        const response = await request(app)
            .post('/users/like/1')
            .set('Authorization', `Bearer ${accessTokenUser2}`)
        expect(response.status).toBe(200)
        expect(response.body.message).toEqual('Liked user successfully')
    })

    test('CANNOT GIVE LIKES TWICE TO THE SAME USER', async () => {
        const response = await request(app)
            .post('/users/like/1')
            .set('Authorization', `Bearer ${accessTokenUser2}`)
        expect(response.status).toBe(400)
        expect(response.body.message).toEqual('You already take an action for this user')
    })

    test('FREE ACCESS EXHAUSTED', async () => {
        const response = await request(app)
            .post('/users/like/3')
            .set('Authorization', `Bearer ${accessTokenUser2}`)
        expect(response.status).toBe(403)
        expect(response.body.message).toEqual('Free access exhausted. Upgrade to premium for unlimited access')
    })

    test('CHANGE SUBSCRIPTION TO PREMIUM', async () => {
        await User.update({ subscription: true }, {
            where: {
                id: 12
            }
        })
        const response = await request(app)
            .post('/users/like/3')
            .set('Authorization', `Bearer ${accessTokenUser2}`)
        expect(response.status).toBe(200)
        expect(response.body.message).toEqual('Liked user successfully')
    })

    test('USER WAS NOT LOGGED IN', async () => {
        const response = await request(app)
            .post('/users/like/5')
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('INVALID TOKEN', async () => {
        const response = await request(app)
            .post('/users/like/5')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('USER NOT FOUND', async () => {
        const response = await request(app)
            .post('/users/like/100')
            .set('Authorization', `Bearer ${accessTokenUser2}`)
        expect(response.status).toBe(404)
        expect(response.body.message).toEqual('Error! not found')
    })

    test('NOT BEARER AUTHEN', async () => {
        const response = await request(app)
            .get('/users/like/9')
            .set('Authorization', `NotBearer ${accessTokenUser3}`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })
})

describe('POST /users/dislike/:idUser', () => {
    test('SUCCESS GIVE A LIKE TO ANOTHER USER', async () => {
        await User.update({ remainingLikes: 1 }, {
            where: {
                id: 13
            }
        })
        const response = await request(app)
            .post('/users/dislike/2')
            .set('Authorization', `Bearer ${accessTokenUser3}`)
        expect(response.status).toBe(200)
        expect(response.body.message).toEqual('Disliked user successfully')
    })

    test('CANNOT GIVE LIKES TWICE TO THE SAME USER', async () => {
        const response = await request(app)
            .post('/users/dislike/2')
            .set('Authorization', `Bearer ${accessTokenUser3}`)
        expect(response.status).toBe(400)
        expect(response.body.message).toEqual('You already take an action for this user')
    })

    test('FREE ACCESS EXHAUSTED', async () => {
        const response = await request(app)
            .post('/users/dislike/4')
            .set('Authorization', `Bearer ${accessTokenUser3}`)
        expect(response.status).toBe(403)
        expect(response.body.message).toEqual('Free access exhausted. Upgrade to premium for unlimited access')
    })

    test('CHANGE SUBSCRIPTION TO PREMIUM', async () => {
        await User.update({ subscription: true }, {
            where: {
                id: 13
            }
        })
        const response = await request(app)
            .post('/users/dislike/4')
            .set('Authorization', `Bearer ${accessTokenUser3}`)
        expect(response.status).toBe(200)
        expect(response.body.message).toEqual('Disliked user successfully')
    })

    test('USER WAS NOT LOGGED IN', async () => {
        const response = await request(app)
            .post('/users/dislike/4')
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('INVALID TOKEN', async () => {
        const response = await request(app)
            .post('/users/dislike/4')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('USER NOT FOUND', async () => {
        const response = await request(app)
            .post('/users/dislike/100')
            .set('Authorization', `Bearer ${accessTokenUser3}`)
        expect(response.status).toBe(404)
        expect(response.body.message).toEqual('Error! not found')
    })

    test('NOT BEARER AUTHEN', async () => {
        const response = await request(app)
            .get('/users/dislike/8')
            .set('Authorization', `NotBearer ${accessTokenUser3}`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })
})

describe('GET /users/matches', () => {
    test('SUCCESS GET LIST MATCHES', async () => {
        let accessTokenUser4
        let user4 = await User.create({
            username: "xabi",
            email: "xabi@gmail.com",
            password: "12345",
            gender: "male",
            interest: "female"
        })
        accessTokenUser4 = signToken(user4)
        await UserProfile.create({
            fullname: 'Xabi Alonso',
            birthdate: '1985-10-05',
            profilePicture: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg',
            address: 'Spain',
            occupation: 'Data Engineering',
            bio: 'Need a girlfriend ASAP!',
            UserId: user4.id,
        })

        let accessTokenUser5
        let user5 = await User.create({
            username: "katy",
            email: "katy@gmail.com",
            password: "12345",
            gender: "female",
            interest: "male"
        })
        accessTokenUser5 = signToken(user5)
        await UserProfile.create({
            fullname: 'Katy Perry',
            birthdate: '1990-01-01',
            profilePicture: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg',
            address: 'Los Angles, US',
            occupation: 'Teacher',
            bio: 'Need a boyfriend ASAP!',
            UserId: user5.id,
        })

        await Connection.create({
            UserIdA: user4.id,
            UserIdB: user5.id,
            status: 'liked'
        })

        await Connection.create({
            UserIdA: user5.id,
            UserIdB: user4.id,
            status: 'liked'
        })
        const response = await request(app)
            .get('/users/matches')
            .set('Authorization', `Bearer ${accessTokenUser4}`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('message', 'Successfully Received Data')
        expect(response.body.data).toBeInstanceOf(Array)
        expect(response.body.data[0]).toHaveProperty('id', user5.id)
    })

    test('THERE IS NO MATCHES', async () => {
        const response = await request(app)
            .get('/users/matches')
            .set('Authorization', `Bearer ${accessTokenUser3}`)
        expect(response.status).toBe(404)
        expect(response.body.message).toEqual('Sorry, no users found at this time')
    })

    test('USER WAS NOT LOGGED IN', async () => {
        const response = await request(app)
            .get('/users/matches')
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('INVALID TOKEN', async () => {
        const response = await request(app)
            .get('/users/matches')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('NOT BEARER AUTHEN', async () => {
        const response = await request(app)
            .get('/users/matches')
            .set('Authorization', `NotBearer ${accessTokenUser3}`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })
})

describe('POST /payment/midtrans/token', () => {
    test('INVALID TOKEN', async () => {
        const response = await request(app)
            .post('/payment/midtrans/token')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('NOT BEARER AUTHEN', async () => {
        const response = await request(app)
            .post('/payment/midtrans/token')
            .set('Authorization', `NotBearer ${accessTokenUser3}`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })
})

describe('POST /chat/:idUser', () => {
    test('SUCCESS CREATE NEW CHAT', async () => {
        let dataBody = {
            UserIdA: 14,
            UserIdB: 15,
        }
        const response = await request(app)
            .post('/chat/15')
            .send(dataBody)
            .set('Authorization', `Bearer ${accessTokenUser6}`)
        expect(response.status).toBe(201)
        expect(response.body.message).toEqual('Chat created successfully')
        expect(response.body.newChat).toHaveProperty('id')
        expect(response.body.newChat).toHaveProperty('UserIdA')
        expect(response.body.newChat).toHaveProperty('UserIdB')
    })

    test('CHAT ALREADY EXISTS', async () => {
        let dataBody = {
            UserIdA: 14,
            UserIdB: 15,
        }
        const response = await request(app)
            .post('/chat/15')
            .send(dataBody)
            .set('Authorization', `Bearer ${accessTokenUser6}`)
        expect(response.status).toBe(400)
        expect(response.body.message).toEqual('Chat already exists')
    })

    test('INVALID TOKEN', async () => {
        const response = await request(app)
            .post('/chat/1')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('NOT BEARER AUTHEN', async () => {
        const response = await request(app)
            .post('/chat/1')
            .set('Authorization', `NotBearer ${accessTokenUser3}`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })
})

describe('GET /chat/find', () => {
    test('SUCCESS FIND CHAT', async () => {
        const response = await request(app)
            .get('/chat/find')
            .set('Authorization', `Bearer ${accessTokenUser6}`)
        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Array)
    })

    test('INVALID TOKEN', async () => {
        const response = await request(app)
            .get('/chat/find')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('NOT BEARER AUTHEN', async () => {
        const response = await request(app)
            .get('/chat/find')
            .set('Authorization', `NotBearer ${accessTokenUser3}`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })
})

describe('POST /message', () => {
    test('SUCCESS CREATE MESSAGE', async () => {
        let dataBody = {
            SenderId: 14,
            ReceiverId: 15,
            content: 'halo',
            ChatId: 1,
        }
        const response = await request(app)
            .post('/message')
            .send(dataBody)
            .set('Authorization', `Bearer ${accessTokenUser6}`)
        expect(response.status).toBe(201)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('SenderId')
        expect(response.body).toHaveProperty('ReceiverId')
    })

    test('FAILED BECAUSE CONTENT IS EMPTY', async () => {
        let dataBody = {
            SenderId: 14,
            ReceiverId: 15,
            content: '',
            ChatId: 1,
        }
        const response = await request(app)
            .post('/message')
            .send(dataBody)
            .set('Authorization', `Bearer ${accessTokenUser8}`)
        expect(response.status).toBe(400)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('message', 'Input your text message!')
    })
    
    test('INVALID TOKEN', async () => {
        let dataBody = {
            SenderId: 14,
            ReceiverId: 15,
            content: 'halo',
            ChatId: 1,
        }
        const response = await request(app)
            .post('/message')
            .send(dataBody)
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('NOT BEARER AUTHEN', async () => {
        let dataBody = {
            SenderId: 14,
            ReceiverId: 15,
            content: 'halo',
            ChatId: 1,
        }
        const response = await request(app)
            .post('/message')
            .send(dataBody)
            .set('Authorization', `NotBearer ${accessTokenUser6}`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })
})

describe('GET /message/:ChatId', () => {
    test('SUCCESS GET MESSAGE', async () => {
        const response = await request(app)
            .get('/message/1')
            .set('Authorization', `Bearer ${accessTokenUser6}`)
        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body[0]).toBeInstanceOf(Object)
        expect(response.body[0]).toHaveProperty('id')
        expect(response.body[0]).toHaveProperty('SenderId')
        expect(response.body[0]).toHaveProperty('ReceiverId')
    })

    test('INVALID TOKEN', async () => {
        const response = await request(app)
            .get('/message/1')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })

    test('NOT BEARER AUTHEN', async () => {
        const response = await request(app)
            .get('/message/1')
            .set('Authorization', `NotBearer ${accessTokenUser6}`)
        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('Invalid token')
    })
})