require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsersModel = require('../models/users');

const tokenExpired = '1d'

exports.getMe = async (req, res) => {
    const id = req.user.id
    try {
        const [data] = await UsersModel.getMe(id)
        res.status(200).json(data[0])
    } catch (error) {
        res.status(400).send(error)
    }
}

// REGISTER
exports.UserRegister = async (req, res) => {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const body = {
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        role: req.body.role,
        isAuth: req.body.isAuth,
        isAdmin: req.body.isAdmin
    }

    try {
        await UsersModel.registerUser(body)
        res.status(201).send('Success');
    } catch (error) {   
        res.status(400).send(error)
        
    }
}

// LOGIN
exports.UserLogin = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    try {
        const [rows] = await UsersModel.getUser(email)
        if(rows.length > 0) {
            const result = rows[0]
            try {
                if( await bcrypt.compare(password, result.password)) {
                    const user = {id: result.id, role: result.role}
                    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: tokenExpired})
                    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
                    const payload = {
                        id: result.id,
                        refreshToken: refreshToken
                    }
                    const data = {
                        id: result.id,
                        name: result.name,
                        email: result.email,
                        role: result.role
                    }
                    await UsersModel.updateToken(payload)
                    res.status(200).json({accessToken: accessToken, refreshToken: refreshToken, user: data});
                } else {
                    res.status(400).send('Password salah');
                }
            } catch (error) {
                res.status(400).send(error)
            }
        } else {
            res.status(400).send('user tidak ditemukan')
        }
    } catch (error) {
        res.status(400).send(error)
    }
}

// REFRESH TOKEN
exports.RefreshToken = async (req, res) => {
    const refreshToken = req.body.token
    if(refreshToken == null) return res.status(401).send('token not found');
    const [rows] = await UsersModel.refreshToken(refreshToken)
    const result = rows[0]
    if(!result) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        const accessToken = jwt.sign({id: user.id, role: user.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: tokenExpired});
        res.json({accessToken: accessToken});
    })
}

//RESET PASSWORD
exports.resetPassword = (req, res) => {
    const token = req.params.token
    const password = req.body.password
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if(err) return res.status(400).send(err)
        const hashPassword = await bcrypt.hash(password, 10)
        const data = {
            id: user.id,
            password: hashPassword
        }
        await UsersModel.updatePassword(data)
        res.status(200).json('OK')
    })
}
// LOGOUT
exports.UserLogout = async (req, res) => {
    const refreshToken = req.body.token
    try {
        await UsersModel.deleteToken(refreshToken)
        res.sendStatus(204);
    } catch (error) {
        res.status(400).send(error);
    }
}