require('dotenv').config();
const pusher = require('../config/pusher');
const axios = require('axios');
const EmployeeModel = require('../models/employee');
const dbPool = require('../config/database');

const token = process.env.API_TOKEN
exports.webhook = async (req, res) => {
    const data = req.body
    let body;
    switch(data.type) {
        case 'attlog':
            attlog(data)
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


async function attlog (data) {
    const cloud_id = data.cloud_id
    const user_id = data.data.pin
    const scan = data.data.scan
    const status_scan = data.data.status_scan
    let sql;
    let values
    let date = new Date()
    let d = date.getDate()
    let m = date.getMonth() +1
    let y = date.getFullYear()
    d = checktime(d)
    m = checktime(m)
    function checktime (i) {
        if(i < 10) {
            return i = `0${i}`
        }
        return i
    }
    let today = `${y}-${m}-${d}`

    // scan jam masuk
    if(status_scan == 0) {
        sql = `SELECT * FROM attendences WHERE user_id='${user_id}' AND scan_date='${today}'`
        const [data] = await dbPool.execute(sql)
        if(data.length == 0) {
            values = {user_id: user_id, time_in: scan, status_scan: status_scan, status: 'Masuk'}
            await dbPool.query('INSERT INTO attendences SET ?', values) 
        } else if(data[0].status !== 'Masuk'){
            await dbPool.query(`UPDATE attendences SET time_in='${scan}', status='Masuk' WHERE user_id='${user_id}' AND scan_date='${today}'`)
        }
    }
    if (status_scan == 1) {
        sql = `SELECT * FROM attendences WHERE user_id='${user_id}' AND status_scan='${status_scan}' AND scan_date='${today}'`
        const [data] = await dbPool.execute(sql)
        if(data.length == 0) {
            values = {time_out: scan, status_scan: status_scan}
            await dbPool.query(`UPDATE attendences SET ? WHERE user_id='${user_id}' AND scan_date='${today}'`, values) 
        }
    }
    pusher.trigger('webhook', 'attlog', {
        message: data.data
    })
}