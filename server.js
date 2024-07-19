const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

// Replace with your MongoDB connection string
mongoose.connect('your-mongodb-connection-string', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).send('User created');
    } catch (error) {
        res.status(400).send(error);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id }, 'your-secret-key', { expiresIn: '1h' });
    res.json({ token });
});

const employeeSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    contractType: String,
    startDate: Date,
    endDate: Date,
    salary: Number,
    kinName: String,
    kinRelationship: String,
    kinPhone: String,
    kinEmail: String
});

const Employee = mongoose.model('Employee', employeeSchema);

app.post('/employee', async (req, res) => {
    const { token } = req.headers;
    try {
        const decoded = jwt.verify(token, 'your-secret-key');
        const employee = new Employee(req.body);
        await employee.save();
        res.status(201).send('Employee data saved');
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));