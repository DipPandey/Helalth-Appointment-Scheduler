document.addEventListener('DOMContentLoaded', function () {
    const uploadForm = document.getElementById('uploadForm');
    const recordsList = document.getElementById('recordsList');

    function displayRecords(records) {
        const rows = records.map(record => {
            return `
                <tr>
                    <td>${record.name}</td>
                    <td>${new Date(record.uploadedDate).toLocaleDateString()}</td>
                    <td>
                        <a href="/uploads/${record.filePath}" class="btn btn-sm btn-primary" target="_blank">View</a>
                        <button class="btn btn-sm btn-primary" onclick="downloadRecord('${record._id}')">Download</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteRecord('${record._id}')">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
        recordsList.innerHTML = rows;
    }

    function loadMedicalRecords() {
        console.log('Loading medical records...');
        fetch('/mrecords', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('Loaded data:', data);
                displayRecords(data);
            })
            .catch(error => console.error('Failed to load medical records:', error));
    }

    uploadForm.onsubmit = function (event) {
        event.preventDefault();
        console.log('Submitting form...');
        const formData = new FormData(uploadForm);
        fetch('/mrecords/upload', {
            method: 'POST',
            headers: {
                // No headers needed for FormData as it sets Content-Type automatically
            },
            body: formData,
        })
            .then(response => {
                console.log('Upload response', response);
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

    loadMedicalRecords(); // Call this function to load records on page load
});

// Functions to implement
function downloadRecord(recordId) {
    console.log('Downloading record with ID:', recordId);
    // Add implementation based on your server setup
}

function deleteRecord(recordId) {
    console.log('Deleting record with ID:', recordId);
    // Add implementation based on your server setup
}
