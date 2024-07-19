document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('token', token);
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('employee-form').style.display = 'block';
    } else {
        alert('Login failed');
    }
});

document.getElementById('employee-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
        return alert('Not authenticated');
    }

    const formData = new FormData(e.target);
    const employee = {};
    formData.forEach((value, key) => {
        employee[key] = value;
    });

    const response = await fetch('/employee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify(employee)
    });

    if (response.ok) {
        addEmployeeToTable(employee);
        alert('Employee data submitted!');
        e.target.reset();
        nextStep(1);
    } else {
        alert('Failed to save employee data');
    }
});

// ... rest of your script.js code ...