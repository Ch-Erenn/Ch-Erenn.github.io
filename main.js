// Get the video element
const video = document.getElementById('video-player');

// Variables to store metrics
let initialDelay = null;
let bufferingEvents = 0;
let stallings = 0;
let loadStartTime = Date.now();



// Event listener for when the video starts playing
video.addEventListener('playing', function() {
  if (initialDelay === null) {
    initialDelay = Date.now() - loadStartTime;
  }
});

// Event listener for when the video is waiting for more data
video.addEventListener('waiting', function() {
  bufferingEvents++;
});

// Event listener for when the video stalls
video.addEventListener('stalled', function() {
  stallings++;
});

// Function to get the metrics
function getMetrics() {
  const playbackQuality = video.getVideoPlaybackQuality ? video.getVideoPlaybackQuality() : {};
  const networkState = video.networkState;
  const currentTime = video.currentTime;
  const bufferedTime = video.buffered.length > 0 ? video.buffered.end(video.buffered.length - 1) : 0;
  const resolution = `${window.screen.width}x${window.screen.height}` 
  const date = new Date();
  return {
    initialDelay: initialDelay,
    bufferingEvents: bufferingEvents,
    stallings: stallings,
    droppedFrames: playbackQuality.droppedVideoFrames || 0,
    corruptedFrames: playbackQuality.corruptedVideoFrames || 0,
    networkState: networkState,
    currentTime: currentTime,
    bufferedTime: bufferedTime,
    resolution: resolution,
    date: `${date.getDate()}-${(date.getMonth()+1)}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
  };
}

// Function to get the survey answers
function getSurveyAnswers() {
  // Retrieve survey answers from your HTML form
  const surveyForm = document.getElementById('surveyForm');
  const formData = new FormData(surveyForm);

  // Convert FormData to JSON
  const surveyAnswers = {};
  formData.forEach((value, key) => {
    surveyAnswers[key] = value;
  });

  return surveyAnswers;
}

// Function to send metrics to your server
function sendMetrics() {

  const dataToSend = {
    metrics: metrics,
    surveyAnswers: surveyAnswers,
  };

  // Sending metrics to the server using Fetch API
  fetch('http://localhost:3000/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataToSend),
  })
  .then(response => {
    if (response.ok) {
      console.log('Data sent successfully!');
    } else {
      console.error('Failed to send data.');
    }
  })
  .catch(error => {
    console.error('Error sending data:', error);
  });
}

/*$("#video-player").on("ended", function() {
  sendMetrics(); // Sending metrics when the video ends
  window.location.href = "questions.html"; // Redirect to the survey page
});*/

// Send metrics every 5 seconds while the video is playing
const interval = setInterval(() => {
  if (!video.paused && !video.ended) {
    sendMetrics();
  } else {
    clearInterval(interval);
  }
}, 5000);


// Function to get QoS data
function getQoSData() {
  // Make a GET request to the server endpoint
  fetch('http://localhost:3000/api')
    .then(response => {
      // Check if the response status is OK (200)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Parse the JSON data from the response
      return response.json();
    })
    .then(data => {
      // Process the retrieved QoS data
      console.log('QoS Data:', data);
      // You can perform further actions with the data here
    })
    .catch(error => {
      // Handle errors during the fetch
      console.error('Error fetching QoS data:', error);
    });
}

// Call the function to get QoS data
getQoSData();

