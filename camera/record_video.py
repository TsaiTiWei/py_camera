require('dotenv').config();
const libcamera = require("node-libcamera");
const axios = require("axios");
const fs = require("fs");

let FormData = require("form-data");

const token = process.env.LINE_TOKEN;

// Start to record a video...
libcamera.video({
        output: 'video/test_2.h264', // 注意：這是將影片保存為 H.264 格式
        timeout: 5000, // 影片錄製時間（毫秒）
        width: 640,
        height: 480
})
        .then((result) => {
                // Start to record a video and save.
                console.log(result);

                // Alert to Line Notify.
                noti();
        })
        .catch((error) => {
                console.log(error);
        });

const noti = () => {
        let form_data = new FormData();
        form_data.append("message", "Here's the video.");
        form_data.append("imageFile", fs.createReadStream('video/test_2.h264')); // 注意：這是從 H.264 文件中讀取

        let headers = Object.assign({
                'Authorization': Bearer ${FiBZ0d8Nt7LcaCgt55FBo6EMxwFGnhzvtfY0zKaI5BV} // 在此填入你的 Line Notify Token
        }, form_data.getHeaders());

        // 上傳影片到 Line Notify 透過 Line API
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