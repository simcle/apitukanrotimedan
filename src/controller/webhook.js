require('dotenv').config();
const pusher = require('../config/pusher');
const axios = require('axios');
const EmployeeModel = require('../models/employee');

const token = process.env.API_TOKEN
exports.webhook = async (req, res) => {
    const data = req.body
    let body;
    switch(data.type) {
        case 'attlog':
            pusher.trigger('webhook', 'attlog', {
                message: data.data
            })
            console.log('attlog')
        break;
        case 'get_userinfo': 
            body = {
                template: data.data.template,
                id: data.data.pin
            }
            await EmployeeModel.updateTemplate(body)
        break;
        case 'set_userinfo': 
            console.log('webhoo.js', data)
        break;
        case 'delete_userinfo':
            console.log('webhook.js','delete_userinfo')
        break;
        case 'get_userid_list':
            console.log('get_userid_list')
        break;
        case 'set_time':
            console.log('set_time')
        break;
        case 'register_online': 
            body = {
                trans_id: data.trans_id,
                cloud_id: data.cloud_id,
                pin: data.trans_id
            }
            await axios.post('https://developer.fingerspot.io/api/get_userinfo', body, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            pusher.trigger('webhook', 'register_online', {
                message: data.data
            })
        break;

    }
    res.status(200).send() 
}