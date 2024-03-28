/* global document, window, alert */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Collect login data
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Prepare data for sending
    const loginData = {
      email,
      password,
    };

    // Send data to server
    fetch('./auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then((data) => {
        if (data.redirectTo) {
          // If login is successful and a redirection URL is provided
          window.location.href = data.redirectTo;
        } else {
          // If login is successful, but no redirection URL is provided
          alert('Login successful');
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  });
    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // Collect signup data
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const username = document.getElementById('signupUsername').value;
            const name = document.getElementById('signupName').value;

            // Prepare data for sending
            const signupData = { email, password, username, name };

            // Send data to server for signup
            fetch('/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupData),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        alert(data.message); // Display success or error message from server
                    }
                    if (data.redirectTo) {
                        window.location.href = data.redirectTo; // Redirect if specified by server
                    } else {
                        // Programmatically switch to the login tab as fallback
                        const loginTab = document.getElementById('login-tab');
                        if (loginTab) loginTab.click();

                        // Optionally, clear the signup form fields
                        document.getElementById('signupEmail').value = '';
                        document.getElementById('signupPassword').value = '';
                        document.getElementById('signupUsername').value = '';
                        document.getElementById('signupName').value = '';
                    }
                })
                .catch(error => {
                    alert('Signup failed: ' + (error.message || 'Unknown error'));
                });
        });
    }
});





