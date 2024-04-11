document.addEventListener('DOMContentLoaded', function () {
    const uploadForm = document.getElementById('uploadForm');
    const recordsList = document.getElementById('recordsList');

    // Function to load existing medical records
    function loadMedicalRecords() {
        fetch('/mrecords/', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(response => response.json())
            .then(data => {
                recordsList.innerHTML = '';
                data.forEach(record => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td>${record.name}</td>
                    <td>${new Date(record.uploadedDate).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="downloadRecord('${record._id}')">Download</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteRecord('${record._id}')">Delete</button>
                    </td>
                `;
                    recordsList.appendChild(row);
                });
            })
            .catch(error => console.error('Failed to load medical records:', error));
    }

    // Function to handle form submission
    uploadForm.onsubmit = function (event) {
        event.preventDefault();
        const formData = new FormData(uploadForm);
        fetch('/mrecords/upload', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: formData,
        })
            .then(response => {
                if (!response.ok) throw new Error('Upload failed');
                return response.json();
            })
            .then(() => {
                $('#uploadModal').modal('hide');
                loadMedicalRecords(); // Reload records list to include the new upload
            })
            .catch(error => {
                console.error('Failed to upload medical record:', error);
                alert('Failed to upload medical record.');
            });
    };

    // Initialize medical records list on page load
    loadMedicalRecords();
});

// Implement downloadRecord and deleteRecord functions as needed
