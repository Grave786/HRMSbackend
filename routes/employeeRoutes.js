const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Create employee
router.post('/', protect, authorizeRoles('Admin', 'HR'), employeeController.createEmployee);

// Get all employees (with filters)
router.get('/', protect, employeeController.getEmployees);

// Get employee by ID
router.get('/:id', protect, employeeController.getEmployeeById);

// Update employee details
router.put('/:id', protect, authorizeRoles('Admin', 'HR'), employeeController.updateEmployee);

// Delete employee
router.delete('/:id', protect, authorizeRoles('Admin'), employeeController.deleteEmployee);

// Update role
router.patch('/:id/role', protect, authorizeRoles('Admin'), employeeController.updateEmployeeRole);

module.exports = router;
