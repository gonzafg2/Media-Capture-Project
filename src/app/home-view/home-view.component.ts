import { Component, OnInit } from '@angular/core';
const myWebCam =
  '872875d005f221a70017ee2559df826695a5467475ef97ef7aa998729e1b616c';

const widthVideo = 320;
const heightVideo = 240;

const constraints = {
  video: {
    width: { min: widthVideo, ideal: widthVideo, max: widthVideo },
    height: { min: heightVideo, ideal: heightVideo, max: heightVideo },
    deviceId: myWebCam,
  },
  audio: false /*{
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },*/,
};

const blobVideoType = { type: 'video/webm' };

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss'],
})
export class HomeViewComponent implements OnInit {
  constructor() {}

  stream: MediaStream | null = null;
  blobsRecorded: Blob | any = [];
  startRecording: boolean = false;
  isRecorded: boolean = false;
  snapshotBase64: string = '';
  mediaRecorder: any;

  async ngOnInit(): Promise<void> {
    const video: any = document.getElementById('video');
    const videoInit = async () => {
      try {
        const mediaDevices = navigator.mediaDevices;

        // const devices = await mediaDevices.enumerateDevices();
        // console.log('devices', devices);

        this.stream = await mediaDevices.getUserMedia(constraints);
        video.srcObject = this.stream;
      } catch (error) {
        console.error(error);
      }
    };
    await videoInit();
  }

  takeSnapshot() {
    const video: any = document.getElementById('video');
    const snapshot: any = document.getElementById('snapshot');
    const ctx = snapshot.getContext('2d');

    if (!ctx) return console.error('No context');

    ctx.drawImage(video, 0, 0, widthVideo, heightVideo);
    this.snapshotBase64 = snapshot.toDataURL();

    // const imgTag: any = document.getElementById('imgTag');
    // if (imgTag) imgTag.src = snapshot.toDataURL();
  }

  recordingVideo() {
    if (!this.stream) return console.error('No cameraStream');

    if (!this.startRecording) {
      const mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'video/webm',
      });
      console.log('mediaRecorder', mediaRecorder);

      this.mediaRecorder = mediaRecorder;

      mediaRecorder.addEventListener('dataavailable', (e) => {
        const downloadLink: any = document.getElementById('downloadLink');
        console.log('downloadLink', downloadLink);
        let video_local = URL.createObjectURL(e.data);
        console.log('video_local', video_local);
        downloadLink.href = video_local;
        downloadLink.download = 'trial.webm';
      });

      mediaRecorder.start();

      return (this.startRecording = true);
    } else if (this.startRecording) {
      this.mediaRecorder.stop();
      this.stream.getTracks().forEach((track: any) => track.stop());
      this.isRecorded = true;

      return (this.startRecording = false);
    }
  }
}
