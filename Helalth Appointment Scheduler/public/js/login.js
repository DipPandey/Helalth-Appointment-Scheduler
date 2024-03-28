/* global document, window, alert */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

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
});
