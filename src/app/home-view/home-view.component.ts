import { Component, OnInit } from '@angular/core';
const myWebCam =
  '872875d005f221a70017ee2559df826695a5467475ef97ef7aa998729e1b616c';

const widthVideo = 320;
const heightVideo = 240;
const videoOptions = {
  mimeType: 'video/webm;codecs=vp8,opus',
};
const audioOptions = {
  mimeType: 'audio/webm',
};

const constraints = {
  video: {
    width: { min: widthVideo, ideal: widthVideo, max: widthVideo },
    height: { min: heightVideo, ideal: heightVideo, max: heightVideo },
    deviceId: myWebCam,
  },
  audio: true,
};

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss'],
})
export class HomeViewComponent implements OnInit {
  constructor() {}

  stream: MediaStream | null = null;
  startRecording: boolean = false;
  startRecordingAudio: boolean = false;
  isRecorded: boolean = false;
  isRecordedAudio: boolean = false;
  snapshotBase64: string = '';
  mediaRecorder: MediaRecorder | null = null;
  mediaRecorderAudio: MediaRecorder | null = null;
  videoRecording: string = '';
  audioRecording: string = '';

  async ngOnInit(): Promise<void> {
    await this.mediaInit();
  }
  async mediaInit() {
    const video: any = document.getElementById('video');
    try {
      const mediaDevices = navigator.mediaDevices;

      // const devices = await mediaDevices.enumerateDevices();
      // console.log('devices', devices);

      this.stream = await mediaDevices.getUserMedia(constraints);
      video.srcObject = this.stream;
    } catch (error) {
      console.error(error);
    }
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

  async recordingVideo() {
    if (!this.stream) return console.error('No mediaStream');

    if (this.startRecording) {
      this.mediaRecorder?.stop();
      // this.stream.getTracks().forEach((track: any) => track.stop());
      this.isRecorded = true;
      return (this.startRecording = false);
    }

    if (!this.stream.active) await this.mediaInit();
    const mediaRecorder = new MediaRecorder(this.stream, videoOptions);
    this.mediaRecorder = mediaRecorder;

    mediaRecorder.addEventListener('dataavailable', (e) => {
      const downloadLink: any = document.getElementById('downloadLink');

      const reader = new FileReader();
      reader.onload = (e) => {
        setTimeout(() => {
          this.videoRecording = e.target?.result as string;
        }, 1000);
      };
      reader.readAsDataURL(e.data);

      downloadLink.href = URL.createObjectURL(e.data);
      downloadLink.download = 'trialVideo.webm';
    });

    this.mediaRecorder.start();
    this.startRecording = true;
  }

  async recordingAudio() {
    return;
    /*
    if (!this.stream) return console.error('No mediaStream');

    if (this.startRecordingAudio && this.mediaRecorderAudio) {
      this.mediaRecorderAudio.stop();
      // this.stream.getTracks().forEach((track: any) => track.stop());
      this.isRecordedAudio = true;
      return (this.startRecordingAudio = false);
    }

    if (!this.stream.active) await this.mediaInit();
    this.mediaRecorderAudio = new MediaRecorder(this.stream, audioOptions);
    console.log('this.mediaRecorderAudio', this.mediaRecorderAudio);

    this.mediaRecorderAudio.addEventListener('dataavailable', (e) => {
      const downloadLinkAudio: any =
        document.getElementById('downloadLinkAudio');

      const reader = new FileReader();
      reader.onload = () => (this.audioRecording = reader.result as string);
      reader.readAsDataURL(e.data);

      downloadLinkAudio.href = URL.createObjectURL(e.data);
      downloadLinkAudio.download = 'trialAudio.webm';
    });

    this.mediaRecorderAudio?.start();
    this.startRecordingAudio = true;
    */
  }
}
