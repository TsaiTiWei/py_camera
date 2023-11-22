require('dotenv').config();
const libcamera = require("node-libcamera");
const axios = require("axios");
const fs = require("fs");

let FormData = require("form-data");

const token = process.env.LINE_TOKEN;

const noti = () => {
    let form_data = new FormData();
    form_data.append("message", "Here's the video.");
    form_data.append("imageFile", fs.createReadStream('video/test_2.h264'));

    let headers = Object.assign({
        'Authorization': Bearer ${token}
    }, form_data.getHeaders());

    axios({
        method: 'post',
        url: "https://notify-api.line.me/api/notify",
        data: form_data,
        headers: headers
    })
        .then((response) => {
            console.log("HTTP StatusCode: " + response.status);
            console.log(response.data);
        })
        .catch((error) => {
            console.error("Failed to send a line notification");
            if (error.response) {
                console.error("HTTP StatusCode: " + error.response.status);
                console.error(error.response.data);
            } else {
                console.error(error);
            }
        });
};

// Start to record a video...
libcamera.video({
    output: 'video/test_2.h264',
    timeout: 5000,
    width: 640,
    height: 480
})
    .then((result) => {
        console.log(result);
        noti(); // Call the noti function after it has been declared.
    })
    .catch((error) => {
        console.log(error);
    });