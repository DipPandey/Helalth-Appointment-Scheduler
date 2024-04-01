
document.addEventListener('DOMContentLoaded', function () {
    // Toggles the edit profile form visibility
    document.getElementById('toggleEditForm').addEventListener('click', function () {
        const editForm = document.getElementById('editProfile');
        editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
    });

    // Fetches user profile data from the server
    function loadUserProfile() {
        fetch('/user/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                // Include authorization headers 
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('User data:', data);
                console.log(data); 
                document.getElementById('editName').value = data.name;
                document.getElementById('editEmail').value = data.email;
                // Update the welcome message with the user's name
                document.querySelector('.user-profile h3').textContent = `Welcome, ${data.name}`;
            })
            .catch(error => console.error('Failed to load user profile', error));
    }

    // Submits the updated user profile data to the server
    document.getElementById('editProfileForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const updatedName = document.getElementById('editName').value;
        const updatedEmail = document.getElementById('editEmail').value;

        console.log('Token:', localStorage.getItem('token'));

        fetch('/user/profile/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                // Include authorization headers if needed
            },
            body: JSON.stringify({ name: updatedName, email: updatedEmail }),
        })
            .then(response => {
                if (!response.ok) throw new Error('Profile update failed');
                return response.json();
            })
            .then(() => {
                alert('Profile updated successfully');
                // Refresh user profile data to reflect updates
                loadUserProfile();
                // Optionally hide the edit form after successful update
                document.getElementById('editProfile').style.display = 'none';
            })
            .catch(error => {
                console.error('Failed to update profile', error);
                alert(error.message);
            });
    });

    

});
