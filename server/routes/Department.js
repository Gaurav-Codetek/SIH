const express = require('express');
const router = express.Router();

const {createDepartment,getDepartmentsByOffice,getCheckedInEmployeesCountByDepartment} = require('../Controllers/Department');

router.post('/createDepartment', createDepartment);
// http://192.168.18.208:3000/api/department/getDepartmentsByOffice/Chandigarh
router.get('/getDepartmentsByOffice/:officeName', getDepartmentsByOffice);

router.get('/office/:officeName/department/:departmentName/checkedin-count', getCheckedInEmployeesCountByDepartment);



module.exports = router;