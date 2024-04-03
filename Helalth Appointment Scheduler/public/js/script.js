document.addEventListener('DOMContentLoaded', function () {
    // Function to display the current date
    function displayCurrentDate() {
        const today = new Date();
        const date = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        document.getElementById('currentDate').textContent += date;
    }

    // Call the function to display the date
    displayCurrentDate();

    // Rest of your dashboard JS code...
});