document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
       
        const loginData = { email, password };

        fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.token) {
                    localStorage.setItem('token', data.token); // Store the token
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem('name', data.name);//storing the name for welcome message
                    
                    
                     // Store user ID if you send it back from the server
                    window.location.href = data.redirectTo || '/dashboard';
                    
                    // Redirect to the dashboard or provided URL
                } else {
                    alert('Login successful, but no token received.');
                }
            })
            .catch((error) => {
                alert('Login failed: ' + error.message);
            });
    });


    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const username = document.getElementById('signupUsername').value; // Assuming you have this field in your form
            const name = document.getElementById('signupName').value; // Assuming you have this field in your form

            const signupData = { email, password, username, name }; // Include other data as needed

            fetch('/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(signupData),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.token) {
                        localStorage.setItem('token', data.token); // Store the token
                        localStorage.setItem('userId', data.userId); // Store user ID if you send it back from the server
                        
                        window.location.href = data.redirectTo || '/dashboard'; // Redirect to the dashboard or provided URL
                    } else {
                        alert(data.message || 'Signup successful, but no token received.');
                    }
                })
                .catch((error) => {
                    alert('Signup failed: ' + error.message);
                });
        });
    }
});
