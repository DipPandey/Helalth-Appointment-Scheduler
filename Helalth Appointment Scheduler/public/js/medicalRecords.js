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
        // Create the HTML string for records
        const recordsHTML = records.map(record => `
        <tr id="record-${record._id}">
            <td>${record.name}</td>
            <td>${new Date(record.uploadedDate).toLocaleDateString()}</td>
            <td>
                <button data-action="view" data-file-path="${record.filePath}" class="btn btn-primary view-button">View</button>
                <button data-action="download" data-record-id="${record._id}" class="btn btn-secondary download-button">Download</button>
                <button data-action="delete" data-record-id="${record._id}" class="btn btn-danger delete-button">Delete</button>
            </td>
        </tr>
    `).join('');

        // Set the innerHTML of the records list to the new recordsHTML string
        recordsList.innerHTML = recordsHTML;

        // Now that the buttons are rendered, you can add event listeners to them
        // However, we can use event delegation on the recordsList to handle all button clicks
        recordsList.addEventListener('click', (event) => {
            // Use event delegation to determine if a button was clicked
            if (event.target.matches('.download-button')) {
                const recordId = event.target.dataset.recordId;
                downloadRecord(recordId);
            }
            // Implement similar event delegation for view and delete actions
            if (event.target.matches('.delete-button')) {
                const recordId = event.target.dataset.recordId;
                deleteRecord(recordId);
            }
            if (event.target.matches('.view-button')) {
                const filePath = event.target.dataset.filePath;
                viewRecord(filePath);
            }
        });
    }

    // No changes needed to the viewRecord, downloadRecord, and deleteRecord functions


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
    function downloadRecord(recordId) {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to download records.');
            return; // Exit the function if there is no token
        }

        // Fetch the file from the server with the Authorization header
        fetch(`/mrecords/download/${recordId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // Retrieve filename from the Content-Disposition header if available
                let filename = 'downloaded_record'; // Default filename if none is provided
                const contentDisposition = response.headers.get('Content-Disposition');
                if (contentDisposition) {
                    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    let matches = filenameRegex.exec(contentDisposition);
                    if (matches != null && matches[1]) {
                        // Remove any surrounding quotes that may be present
                        filename = matches[1].replace(/['"]/g, '');
                    }
                }
                return response.blob().then(blob => {
                    // Create a URL for the blob
                    const url = window.URL.createObjectURL(blob);
                    // Create a temporary anchor element and trigger the download
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename; // Use the filename from the header
                    document.body.appendChild(a); // Append anchor to body
                    a.click(); // Trigger the download
                    window.URL.revokeObjectURL(url); // Clean up the URL object
                    a.remove(); // Remove anchor from the body
                });
            })
            .catch(e => {
                console.error('Download failed:', e);
                alert('Download failed: ' + e.message);
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
        // Assuming 'filePath' is the relative path to the file
        const url = `/uploads/${filePath}`;
        window.open(url, '_blank'); // Open the file in a new tab
    };

    // Initially load medical records
    loadMedicalRecords();
});
