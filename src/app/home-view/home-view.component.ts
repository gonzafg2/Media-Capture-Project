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
  audio: false/*{
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },*/
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
  }

  recordingVideo() {
    const downloadLink: any = document.getElementById('downloadLink');
    if (!this.stream) return console.error('No cameraStream');

    // set MIME type of recording as video/webm
    const mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: 'video/webm',
    });
    console.log('mediaRecorder', mediaRecorder);

    if (this.startRecording) {
      console.log('mediaRecorder stop within if');

      this.startRecording = false;
      return mediaRecorder.stop();
    }

    // event : new recorded video blob available
    mediaRecorder.addEventListener('dataavailable', (e) =>
      this.blobsRecorded.push(e.data)
    );

    // event : recording stopped & all blobs sent
    mediaRecorder.addEventListener('stop', () => {
      console.log('mediaRecorder stopped');

      // create local object URL from the recorded video blobs
      let video_local = URL.createObjectURL(
        new Blob(this.blobsRecorded, blobVideoType)
      );
      if (downloadLink) downloadLink.href = video_local;
      this.isRecorded = true;
    });

    // start recording with each recorded blob having 1 second video
    mediaRecorder.start(1000);

    this.startRecording = true;
  }
}
