const { exec } = require('child_process');
const axios = require('axios');

const startRecording = () => {
  const outputFilename = 'output.mp4';

  // 使用 ffmpeg 录制视频，持续 10 秒
  const command = `ffmpeg -f v4l2 -i /dev/video0 -t 10 ${outputFilename}`;

  const child = exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Video recording complete. Output saved to: ${outputFilename}`);

    // 上传视频到 Line Notify
    uploadToLineNotify(outputFilename);
  });

  // 在一定时间后停止录制
  setTimeout(() => {
    child.kill('SIGINT');
  }, 10000);
};

const uploadToLineNotify = async (videoPath) => {
  const lineNotifyToken = 'YOUR_LINE_NOTIFY_TOKEN'; // 替换为你的 Line Notify Token
  const apiUrl = 'https://notify-api.line.me/api/notify';

  try {
    // 通过axios上传视频
    const response = await axios.post(apiUrl, null, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${lineNotifyToken}`
      },
      params: {
        message: 'New video from Raspberry Pi', // 通知的消息
      },
      data: {
        imageFile: {
          value: require('fs').createReadStream(videoPath),
          options: {
            filename: 'output.mp4',
            contentType: 'video/mp4'
          }
        }
      }
    });

    console.log('Video uploaded to Line Notify successfully');
  } catch (error) {
    console.error('Error uploading video to Line Notify:', error.message);
  }
};

// 启动视频录制
startRecording();
