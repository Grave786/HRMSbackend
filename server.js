const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db'); 
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser'); 

const authRoutes = require('./routes/authRoutes'); 
const employeeRoutes = require('./routes/employeeRoutes'); 
const candidateRoutes = require('./routes/candidateRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');

dotenv.config();

const app = express();


const corsOptions = {
  origin: 'https://hrmsfrontend-six.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 
app.use(express.json());
app.use(cookieParser());

connectDB();


app.use('/uploads', express.static(path.join(__dirname, 'public/uploads/resumes')));

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the HRMS API!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
