require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsersModel = require('../models/users');
const sendEmail = require('../config/mailer');
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
                if(!result.is_auth) {
                    return res.status(400).send('Email tidak ditemukan')
                }
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
            res.status(400).send('Email tidak ditemukan')
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

exports.updatePassword = async (req, res) => {
    const id = req.params.id
    const hashPassword = await bcrypt.hash(req.body.new_password, 10);
    const data = {
        password: hashPassword,
        id: id
    }
    try {
        await UsersModel.updatePassword(data)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}

// LOST PASSWORD
exports.lostPassword = async (req, res) => {
    const email = req.body.email
    try {
        const [data] = await UsersModel.lostPassword(email)
        if(data.length == 0) {
            return res.status(400).send('Email tidak terdaftar')
        }
        const user_id = data[0].id
        const role = data[0].role
        const token = jwt.sign({id: user_id, role: role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
        const templateEmail = {
            from: '"ROSCO NAULI BAKERY" <admin@tukangrotimedan.com>',
            to: email,
            subject: 'Reset Password',
            html: `<p>Silahkan kilik link dibawah ini untuk reset password anda</p><p>${process.env.CLIENT_URL}/resetPassword/${token}</p>`
        }
        sendEmail(templateEmail)
        .then(info => {
            res.status(200).json(info)
        })
        .catch(err => {
            res.status(400).send(err)
        })
    } catch (error) {
        res.status(400).send(error)
    }
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