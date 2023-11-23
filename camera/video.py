from picamera import PiCamera
from time import sleep
import requests
import os

# 初始化相機
camera = PiCamera()
camera.resolution = (640, 480)  # 設定影片的寬度和高度

# 開始錄製影片
camera.start_recording('video.h264')
sleep(5)  # 錄製 5 秒
camera.stop_recording()

# 將 H.264 影片轉換為 MP4 格式
convert_command = "ffmpeg -i video.h264 -vcodec copy -acodec aac video.mp4"
os.system(convert_command)

# LINE Notify 設定
url = "https://notify-api.line.me/api/notify"
token = "YOUR_LINE_NOTIFY_TOKEN"  # 替換為你的 LINE Notify 權杖

headers = {
    "Authorization": f"Bearer {token}"
}

files = {
    "message": "Here's the video.",
    "imageFile": open("video.mp4", "rb")
}

# 上傳影片到 LINE Notify
response = requests.post(url, headers=headers, files=files)

print(response.status_code, response.text)
