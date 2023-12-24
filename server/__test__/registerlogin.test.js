const request = require('supertest')
const { app } = require('../app')
const { User, UserProfile, Connection } = require('../models')
const { signToken } = require('../helpers/jwt')
const fs = require('fs')


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

describe('POST /register', () => {
    test('SUCCESS REGISTER', async () => {
        let dataBody = {
            username: "user1",
            email: "user1@gmail.com",
            password: "12345",
            gender: "male",
            interest: "female"
        }
        const response = await request(app)
            .post('/register')
            .send(dataBody)
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id', expect.any(Number))
        expect(response.body).toHaveProperty('username', dataBody.username)
        expect(response.body).toHaveProperty('email', dataBody.email)
        expect(response.body).toMatchObject({
            id: expect.any(Number),
            username: "user1",
            email: "user1@gmail.com"
        })
    })

    test('WITHOUT USERNAME', async () => {
        let dataBody = {
            email: "withoutusername@gmail.com",
            password: "12345",
            gender: "male",
            interest: "female"
        }
        const response = await request(app)
            .post('/register')
            .send(dataBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "Username is required")
    })

    test('WITHOUT EMAIL', async () => {
        let dataBody = {
            username: "withoutemail",
            password: "12345",
            gender: "male",
            interest: "female"
        }
        const response = await request(app)
            .post('/register')
            .send(dataBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "Email is required")
    })

    test('WITHOUT PASSWORD', async () => {
        let dataBody = {
            username: "withoutpassword",
            email: "withoutpassword@gmail.com",
            gender: "male",
            interest: "female"
        }
        const response = await request(app)
            .post('/register')
            .send(dataBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "Password is required")
    })

    test('USERNAME EMPTY STRING', async () => {
        let dataBody = {
            username: "",
            email: "usernameempty@gmail.com",
            password: "12345",
            gender: "male",
            interest: "female"
        }
        const response = await request(app)
            .post('/register')
            .send(dataBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "Username is required")
    })

    test('EMAIL EMPTY STRING', async () => {
        let dataBody = {
            username: "emptyemail",
            email: "",
            password: "12345",
            gender: "male",
            interest: "female"
        }
        const response = await request(app)
            .post('/register')
            .send(dataBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "Email is required")
    })

    test('PASSWORD EMPTY STRING', async () => {
        let dataBody = {
            username: "passwordempty",
            email: "passwordempty@gmail.com",
            password: "",
            gender: "male",
            interest: "female"
        }
        const response = await request(app)
            .post('/register')
            .send(dataBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "Password is required")
    })
    
    test('PASSWORD LESS THAN 5 CHARACTERS', async () => {
        let dataBody = {
            username: "pwdless5chara",
            email: "pwdless5chara@gmail.com",
            password: "123",
            gender: "male",
            interest: "female"
        }
        const response = await request(app)
            .post('/register')
            .send(dataBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "The minimum password length is 5 characters")
    })

    test('WITHOUT GENDER', async () => {
        let dataBody = {
            username: "nogender",
            email: "nogender@gmail.com",
            password: "12345",
            interest: "female"
        }
        const response = await request(app)
            .post('/register')
            .send(dataBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "Gender is required")
    })

    test('GENDER IS EMPTY STRING', async () => {
        let dataBody = {
            username: "genderempty",
            email: "genderempty@gmail.com",
            password: "12345",
            gender: "",
            interest: "female"
        }
        const response = await request(app)
            .post('/register')
            .send(dataBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "Gender is required")
    })

    test('GENDER NOT MALE OR FEMALE', async () => {
        let dataBody = {
            username: "nomalenofemale",
            email: "nomalenofemale@gmail.com",
            password: "12345",
            gender: "cwk",
            interest: "female"
        }
        const response = await request(app)
            .post('/register')
            .send(dataBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "Invalid gender. Choose either male or female")
    })

    test('WITHOUT INTEREST', async () => {
        let dataBody = {
            username: "nogender",
            email: "nogender@gmail.com",
            password: "12345",
            gender: "male"
        }
        const response = await request(app)
            .post('/register')
            .send(dataBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "Interest is required")
    })

    test('INTEREST IS EMPTY STRING', async () => {
        let dataBody = {
            username: "Interestempty",
            email: "Interestempty@gmail.com",
            password: "12345",
            gender: "male",
            interest: ""
        }
        const response = await request(app)
            .post('/register')
            .send(dataBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "Interest is required")
    })

    test('INTEREST NOT MALE OR FEMALE', async () => {
        let dataBody = {
            username: "nomalenofemale",
            email: "nomalenofemale@gmail.com",
            password: "12345",
            gender: "male",
            interest: "cwk"
        }
        const response = await request(app)
            .post('/register')
            .send(dataBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "Invalid interest. Choose either male or female")
    })

    test('USERNAME ALREADY EXIST', async () => {
        let dataBody = {
            username: "user1",
            email: "user1@gmail.com",
            password: "12345",
            gender: "male",
            interest: "female"
        }
        const response = await request(app)
            .post('/register')
            .send(dataBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "Username already exists")
    })

    test('EMAIL ALREADY EXIST', async () => {
        let dataBody = {
            username: "user12",
            email: "user1@gmail.com",
            password: "12345",
            gender: "male",
            interest: "female"
        }
        const response = await request(app)
            .post('/register')
            .send(dataBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "Email already exists")
    })

    test('EMAIL FORMAT IS WRONG', async () => {
        let dataBody = {
            username: "wrongemailformat",
            email: "userom123",
            password: "12345",
            gender: "male",
            interest: "female"
        }
        const response = await request(app)
            .post('/register')
            .send(dataBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "Email format is wrong")
    })
})


describe('POST /login', () => {
    test('SUCCESS LOGIN', async () => {
        let dataBody = {
            email: "user1@gmail.com",
            password: "12345"
        }
        const response = await request(app)
            .post('/login')
            .send(dataBody)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('access_token', expect.any(String))
        expect(response.body).toHaveProperty('username', expect.any(String))
    })

    test('WITHOUT EMAIL', async () => {
        let dataBody = {
            password: "12345"
        }
        const response = await request(app)
            .post('/login')
            .send(dataBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "Email is required")
    })

    test('WITHOUT PASSWORD', async () => {
        let dataBody = {
            email: "user1@gmail.com"
        }
        const response = await request(app)
            .post('/login')
            .send(dataBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', "Password is required")
    })

    test('EMAIL INVALID / NOT REGISTERED', async () => {
        let dataBody = {
            email: "random@gmail.com",
            password: "12345"
        }
        const response = await request(app)
            .post('/login')
            .send(dataBody)
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('message', "Invalid email or password!")
    })

    test('WRONG PASSWORD', async () => {
        let dataBody = {
            email: "user1@gmail.com",
            password: "WRONG PASSWORD"
        }
        const response = await request(app)
            .post('/login')
            .send(dataBody)
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('message', "Invalid email or password!")
    })
})
