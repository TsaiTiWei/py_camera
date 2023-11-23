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

    // 在錄制完成後，上傳至 Line Notify
    uploadToLineNotify(outputFilename);
  });

  // 在一定时间后停止录制
  setTimeout(() => {
    child.kill('SIGINT');
  }, 10000);
};

const uploadToLineNotify = async (filename) => {
  const lineNotifyToken = 'sm545ZAvFjAbHffJRAfSa8D2iuT8d7DAhjvthB5sEnf'; // 記得替換成你的 Line Notify token
  const lineNotifyAPI = 'https://notify-api.line.me/api/notify';

  try {
    const response = await axios.post(
      lineNotifyAPI,
      `message=Video recording complete. Output saved to: ${filename}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${lineNotifyToken}`,
        },
      }
    );

    console.log('Line Notify response:', response.data);
  } catch (error) {
    console.error('Error sending notification to Line Notify:', error.message);
  }
};

// 启动视频录制
startRecording();
