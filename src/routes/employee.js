const express = require('express');
const router = express.Router();

const employeeController = require('../controller/employee');

router.get('/', employeeController.getAllEmployee);
router.get('/invite', employeeController.inviteEmployee);
router.post('/invite', employeeController.sendInviteEmployee);
router.get('/detail/:id', employeeController.getEmployee);
router.get('/attlog/:id', employeeController.getAttendence);
router.get('/create', employeeController.createEmployee);
router.post('/', employeeController.insertEmployee);
router.put('/', employeeController.updateEmployee);
router.post('/fingerprint', employeeController.fingerPrint);
router.post('/resign', employeeController.resignEmployee);
router.post('/activate', employeeController.activateEmployee);
router.delete('/delete/:id', employeeController.deleteEmployee)
router.post('/undang', employeeController.undangEmployee);
router.delete('/user/:id', employeeController.deleteEmployeeUser);
module.exports = router