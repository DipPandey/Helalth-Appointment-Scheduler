document.addEventListener('DOMContentLoaded', function () {
    const uploadForm = document.getElementById('uploadForm');
    const recordsList = document.getElementById('recordsList');

    // Function to handle uploading a new medical record
    uploadForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        fetch('/mrecords/upload', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                }
                loadMedicalRecords(); // Refresh the list
            })
            .catch(error => {
                console.error('Upload Error:', error);
                alert('Failed to upload record.');
            });
    });

    // Function to display records on the page
    function displayRecords(records) {
        recordsList.innerHTML = records.map(record => `
            <tr id="record-${record._id}">
                <td>${record.name}</td>
                <td>${new Date(record.uploadedDate).toLocaleDateString()}</td>
                <td>
                    <button onclick="viewRecord('${record.filePath}')" class="btn btn-primary">View</button>
                    <button onclick="downloadRecord('${record._id}')" class="btn btn-secondary">Download</button>
                    <button onclick="deleteRecord('${record._id}')" class="btn btn-danger">Delete</button>
                </td>
            </tr>
        `).join('');
        // Set innerHTML of records list to the records HTML string
        recordsList.innerHTML = recordsHTML;

        // Event delegation for view, download, and delete buttons
        recordsList.addEventListener('click', (event) => {
            const action = event.target.getAttribute('data-action');
            const recordId = event.target.getAttribute('data-record-id');
            const filePath = event.target.getAttribute('data-file-path');

            switch (action) {
                case 'view':
                    viewRecord(filePath);
                    break;
                case 'download':
                    downloadRecord(recordId);
                    break;
                case 'delete':
                    deleteRecord(recordId);
                    break;
                default:
                    // If it's not a recognized action, do nothing
                    break;
            }
        });
    }

    // Function to load medical records from the server
    function loadMedicalRecords() {
        fetch('/mrecords', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        })
            .then(response => response.json())
            .then(data => {
                displayRecords(data);
            })
            .catch(error => {
                console.error('Load Error:', error);
            });
    }

    // Function to delete a record
    window.deleteRecord = function (recordId) {
        if (confirm('Are you sure you want to delete this record?')) {
            fetch(`/mrecords/${recordId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        alert(data.message);
                    }
                    loadMedicalRecords(); // Refresh the list
                })
                .catch(error => {
                    console.error('Delete Error:', error);
                    alert('Failed to delete record.');
                });
        }
    };

    // Function to view a record
    window.viewRecord = function (filePath) {
        window.open(`/uploads/${filePath}`);
    };

    // Function to download a record
    window.downloadRecord = function (recordId) {
        // Add implementation based on how you handle file downloads
        window.location = `/mrecords/download/${recordId}`;
    };

    // Initially load medical records
    loadMedicalRecords();
});
