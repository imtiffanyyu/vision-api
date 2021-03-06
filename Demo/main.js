// Copyright 2015, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// INSERT API KEY
var apiKey = "AIzaSyDbyarhNgV0VlMWvQbJZlhJ8mQhR_APoEA";
var CV_URL = "https://vision.googleapis.com/v1/images:annotate?key=" + apiKey;

/**
 * 'submit' event handler - reads the image bytes and sends it to the Cloud
 * Vision API.
 */
function uploadFiles(event) {
  event.preventDefault(); // Prevent the default form post
  var form = document.querySelector('form'); //get the form data from html
  var file = new FormData(form).get('fileField'); // get the picture that should be uploaded
  var reader = new FileReader(); // create a Reader that can read the chosen picture
  reader.onloadend = processFile; // add a function to the Reader that should be executed after the file is loaded
  reader.readAsDataURL(file); // read the file
}

/**
 * Event handler for a file's data url - extract the image data and pass it off.
 */
function processFile(event) {
  var content = event.target.result;
  sendFileToCloudVision(content.replace("data:image/jpeg;base64,", ""));
}

/**
 * Sends the given file contents to the Cloud Vision API and outputs the
 * results.
 */
function sendFileToCloudVision(content) {
  var form = document.querySelector('form'); //get the form data from html
  var type = new FormData(form).get('type'); // get the type that should be used for tagging

  // Strip out the file prefix when you convert to json.
  var data = {
    requests: [{
      image: {
        content: content
      },
      features: [{
        type: type,
        maxResults: 200
      }]
    }]
  };

  setResult('Loading...');

  var request = new XMLHttpRequest();
  request.open('POST', CV_URL, true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(
    JSON.stringify(data)
  );

  request.onload = function() {
    setResult(request.responseText);
  };

  request.onerror = function(errorThrown) {
    // There was a connection error of some sort
    setResult('ERRORS: ', errorThrown);
  };
}

function setResult(result) {
  var resultTag = document.getElementById('results');
  resultTag.innerHTML = result;
}
