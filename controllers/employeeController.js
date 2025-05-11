const Employee = require('../models/Employee');

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Private (e.g., Admin or HR)
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, phone, department, role, status, startDate } = req.body;
    const employee = new Employee({ name, email, phone, department, role, status, startDate });
    await employee.save();
    res.status(201).json({ message: 'Employee created', employee });
  } catch (err) {
    res.status(500).json({ message: 'Error creating employee', error: err.message });
  }
};

// @desc    Get all employees (with optional filters/search)
// @route   GET /api/employees
// @access  Private
exports.getEmployees = async (req, res) => {
  try {
    const filters = {};

    if (req.query.name) filters.name = { $regex: req.query.name, $options: 'i' };
    if (req.query.department) filters.department = req.query.department;
    if (req.query.status) filters.status = req.query.status;

    const employees = await Employee.find(filters).sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employees', error: err.message });
  }
};

// @desc    Get a single employee by ID
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employee', error: err.message });
  }
};

// @desc    Update employee details
// @route   PUT /api/employees/:id
// @access  Private (e.g., Admin/HR)
exports.updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });

    res.json({ message: 'Employee updated', employee: updatedEmployee });
  } catch (err) {
    res.status(500).json({ message: 'Error updating employee', error: err.message });
  }
};

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
// @access  Private (Admin only)
exports.deleteEmployee = async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Employee not found' });

    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting employee', error: err.message });
  }
};

// @desc    Update employee role
// @route   PATCH /api/employees/:id/role
// @access  Private (Admin only)
exports.updateEmployeeRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) return res.status(400).json({ message: 'Role is required' });

    const employee = await Employee.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    res.json({ message: 'Role updated successfully', employee });
  } catch (err) {
    res.status(500).json({ message: 'Error updating role', error: err.message });
  }
};
