document.addEventListener('DOMContentLoaded', function() {
    const videoFeed = document.getElementById('bg');
    const startCaptureButton = document.getElementById('startCapture');
    const stopCaptureButton = document.getElementById('stopCapture');

    // Start video capture
    startCaptureButton.addEventListener('click', async () => {
        try {
            // Start the server-side camera and model
            const response = await fetch('/start_camera/');
            const data = await response.json();
            if (!data.success) {
                throw new Error('Failed to start camera on server');
            }

            // Show and start the video feed
            videoFeed.src = videoFeedUrl; // This will be defined in the template
            videoFeed.style.display = 'block';
            startCaptureButton.disabled = true;
            stopCaptureButton.disabled = false;

            // Start updating song recommendations
            startUpdates();

        } catch (err) {
            console.error('Camera Error:', err);
            alert(`Failed to start camera: ${err.message}`);
            startCaptureButton.disabled = false;
            stopCaptureButton.disabled = true;
        }
    });

    // Stop video capture
    stopCaptureButton.addEventListener('click', async () => {
        try {
            // Stop the server-side camera and model
            await fetch('/stop_camera/');

            // Hide and clear the video feed
            videoFeed.style.display = 'none';
            videoFeed.src = '';
            startCaptureButton.disabled = false;
            stopCaptureButton.disabled = true;

            // Stop updating song recommendations
            stopUpdates();

        } catch (err) {
            console.error('Error stopping camera:', err);
            alert('Error stopping camera: ' + err.message);
        }
    });
});

function CreateHtmlTable(data) {
    // Clear previous content
    $("#ResultArea").html("");

    // If no data or empty array, show message
    if (!data || data.length === 0) {
        var emptyTable = `
            <table class="table table-dark text-center" id="DynamicTable">
                <tr>
                    <td colspan="2">Start camera and wait for emotion detection...</td>
                </tr>
            </table>`;
        $("#ResultArea").html(emptyTable);
        return;
    }

    // Build the table structure with Bootstrap classes
    var tableHtml = `
        <table class="table table-dark table-hover" id="DynamicTable">
            <thead>
                <tr>
                    <th>Song</th>
                    <th>Recommended Songs URLs</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Iterate through the data array to populate rows
    data.forEach((item, index) => {
        tableHtml += `
            <tr>
                <td>Song ${index + 1}</td>
                <td><a href="${item.uri}" target="_blank">${item.uri}</a></td>
            </tr>
        `;
    });

    // Close the table tags
    tableHtml += `
            </tbody>
        </table>
    `;

    // Append the generated table to the ResultArea
    $("#ResultArea").html(tableHtml);
}


let updateInterval = null;

function startUpdates() {
    updateInterval = setInterval(function() {
        $.getJSON('/t', function(data) {
            try {
                // Parse the data if it's a string
                const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
                CreateHtmlTable(parsedData);
            } catch (error) {
                console.error('Error parsing data:', error);
                CreateHtmlTable([]); // Show empty state on error
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Failed to fetch updates:', textStatus, errorThrown);
            CreateHtmlTable([]); // Show empty state on error
        });
    }, 1000); // Update every second
}

function stopUpdates() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
        CreateHtmlTable([]); // Clear the table when stopped
    }
}
