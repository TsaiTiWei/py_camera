require('dotenv').config();
const libcamera = require("node-libcamera");
const { exec } = require('child_process');
const axios = require("axios");
const fs = require("fs");

let FormData = require("form-data");

const token = process.env.LINE_TOKEN;

// 使用 child_process 执行 libcamera 命令来录制视频
exec('libcamera.vid -o test_11.h624 -t 5000 --width 640 --height 480', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
    }
    
    console.log(`stdout: ${stdout}`);

    // 录制完成后进行 Line Notify 提醒
    noti();
});

const noti = () => {
    let form_data = new FormData();
    form_data.append("message", "Here's the video.");
    form_data.append("imageFile", fs.createReadStream('test_11.h624'));

    let headers = Object.assign({
        'Authorization': `Bearer ${token}`
    }, form_data.getHeaders());

    axios({
        method: 'post',
        url: "https://notify-api.line.me/api/notify",
        data: form_data,
        headers: headers
    })
    .then((response) => {
        console.log("HTTP StateCode:" + response.status);
        console.log(response.data);
    })
    .catch((error) => {
        console.error("Failed to send a line notification");
        if (error.response) {
            console.error("HTTP StatusCode:" + error.response.status);
            console.error(error.response.data);
        } else {
            console.error(error);
        }
    });
};
