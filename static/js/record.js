/*
  LearnIt - In-browser Video Recorder
  - Uses MediaDevices.getUserMedia and MediaRecorder
  - Records to WebM (VP8/VP9/Opus) where supported
  - Provides device selection, pause/resume, mute, camera toggle, timer, size, and download
*/
(function () {
  const secureWarning = document.getElementById('secureWarning');
  const livePreview = document.getElementById('livePreview');
  const playback = document.getElementById('playback');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resumeBtn = document.getElementById('resumeBtn');
  const stopBtn = document.getElementById('stopBtn');
  const muteBtn = document.getElementById('muteBtn');
  const cameraToggleBtn = document.getElementById('cameraToggleBtn');
  const timerEl = document.getElementById('timer');
  const sizeLabel = document.getElementById('sizeLabel');
  const mimeLabel = document.getElementById('mimeLabel');
  const downloadLink = document.getElementById('downloadLink');
  const newRecordingBtn = document.getElementById('newRecordingBtn');
  const recordingBadge = document.getElementById('recordingBadge');
  const refreshDevicesBtn = document.getElementById('refreshDevices');
  const cameraSelect = document.getElementById('cameraSelect');
  const micSelect = document.getElementById('micSelect');

  if (!livePreview) return; // Don't execute on other pages

  let currentStream = null;
  let mediaRecorder = null;
  let recordedBlobs = [];
  let timerInterval = null;
  let recordingStartMs = 0;

  function isSecureContextOrLocalhost() {
    const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname === '::1';
    return window.isSecureContext || isLocalhost;
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function formatBytes(bytes) {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      const kb = bytes / 1024;
      return `${kb.toFixed(1)} KB`;
    }
    return `${mb.toFixed(2)} MB`;
  }

  function stopStreamTracks(stream) {
    if (!stream) return;
    stream.getTracks().forEach(t => t.stop());
  }

  async function listDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(d => d.kind === 'videoinput');
    const audioInputs = devices.filter(d => d.kind === 'audioinput');

    const currentVideoId = cameraSelect.value;
    const currentAudioId = micSelect.value;

    cameraSelect.innerHTML = '';
    micSelect.innerHTML = '';

    for (const v of videoInputs) {
      const opt = document.createElement('option');
      opt.value = v.deviceId;
      opt.textContent = v.label || `Camera ${cameraSelect.length + 1}`;
      cameraSelect.appendChild(opt);
    }
    for (const a of audioInputs) {
      const opt = document.createElement('option');
      opt.value = a.deviceId;
      opt.textContent = a.label || `Microphone ${micSelect.length + 1}`;
      micSelect.appendChild(opt);
    }

    if (currentVideoId) cameraSelect.value = currentVideoId;
    if (currentAudioId) micSelect.value = currentAudioId;
  }

  async function getStream() {
    stopStreamTracks(currentStream);
    const videoDeviceId = cameraSelect.value || undefined;
    const audioDeviceId = micSelect.value || undefined;

    const constraints = {
      audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : { echoCancellation: true, noiseSuppression: true },
      video: videoDeviceId ? { deviceId: { exact: videoDeviceId }, width: { ideal: 1280 }, height: { ideal: 720 } } : { width: { ideal: 1280 }, height: { ideal: 720 } },
    };

    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    livePreview.srcObject = currentStream;
    return currentStream;
  }

  function pickMimeType() {
    const preferred = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4', // rare in MediaRecorder
    ];
    for (const type of preferred) {
      if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return '';
  }

  function resetUI() {
    timerEl.textContent = '00:00';
    sizeLabel.textContent = '0 MB';
    mimeLabel.textContent = '—';
    recordingBadge.hidden = true;
    downloadLink.hidden = true;
    newRecordingBtn.hidden = true;
    playback.srcObject = null;
    playback.removeAttribute('src');
    playback.load();
  }

  function setButtonsState(state) {
    switch (state) {
      case 'idle':
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resumeBtn.disabled = true;
        stopBtn.disabled = true;
        break;
      case 'recording':
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resumeBtn.disabled = true;
        stopBtn.disabled = false;
        break;
      case 'paused':
        startBtn.disabled = true;
        pauseBtn.disabled = true;
        resumeBtn.disabled = false;
        stopBtn.disabled = false;
        break;
      case 'stopped':
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resumeBtn.disabled = true;
        stopBtn.disabled = true;
        break;
    }
  }

  function startTimer() {
    recordingStartMs = Date.now();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const elapsed = (Date.now() - recordingStartMs) / 1000;
      timerEl.textContent = formatTime(elapsed);
    }, 250);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  async function startRecording() {
    recordedBlobs = [];
    const mimeType = pickMimeType();
    const stream = currentStream || (await getStream());
    const options = mimeType ? { mimeType } : undefined;
    mediaRecorder = new MediaRecorder(stream, options);
    mimeLabel.textContent = mediaRecorder.mimeType || 'default';

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
        const size = recordedBlobs.reduce((acc, b) => acc + b.size, 0);
        sizeLabel.textContent = formatBytes(size);
      }
    };

    mediaRecorder.onstart = () => {
      setButtonsState('recording');
      recordingBadge.hidden = false;
      startTimer();
      downloadLink.hidden = true;
      newRecordingBtn.hidden = true;
    };

    mediaRecorder.onpause = () => {
      setButtonsState('paused');
      recordingBadge.hidden = false;
      stopTimer();
    };

    mediaRecorder.onresume = () => {
      setButtonsState('recording');
      recordingBadge.hidden = false;
      startTimer();
    };

    mediaRecorder.onstop = () => {
      setButtonsState('stopped');
      recordingBadge.hidden = true;
      stopTimer();

      const blob = new Blob(recordedBlobs, { type: mediaRecorder.mimeType || 'video/webm' });
      const url = URL.createObjectURL(blob);
      playback.src = url;
      playback.controls = true;
      downloadLink.href = url;
      const ext = (blob.type.includes('mp4') ? 'mp4' : 'webm');
      downloadLink.download = `recording_${new Date().toISOString().replace(/[:.]/g, '-')}.${ext}`;
      downloadLink.hidden = false;
      newRecordingBtn.hidden = false;
    };

    mediaRecorder.start(250); // gather data every 250ms
  }

  function pauseRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.pause();
  }

  function resumeRecording() {
    if (mediaRecorder && mediaRecorder.state === 'paused') mediaRecorder.resume();
  }

  function stopRecording() {
    if (mediaRecorder && (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused')) {
      mediaRecorder.stop();
    }
  }

  function toggleMute() {
    if (!currentStream) return;
    const audioTracks = currentStream.getAudioTracks();
    for (const track of audioTracks) track.enabled = !track.enabled;
    const isMuted = audioTracks.length > 0 && audioTracks.every(t => !t.enabled);
    muteBtn.innerHTML = isMuted ? "<i class='bx bx-microphone-off'></i> Unmute" : "<i class='bx bx-microphone'></i> Mute";
  }

  function toggleCamera() {
    if (!currentStream) return;
    const videoTracks = currentStream.getVideoTracks();
    for (const track of videoTracks) track.enabled = !track.enabled;
    const isOff = videoTracks.length > 0 && videoTracks.every(t => !t.enabled);
    cameraToggleBtn.innerHTML = isOff ? "<i class='bx bx-video-off'></i> Camera On" : "<i class='bx bx-video'></i> Camera Off";
  }

  function newRecording() {
    recordedBlobs = [];
    resetUI();
    setButtonsState('idle');
  }

  async function initialize() {
    if (!isSecureContextOrLocalhost()) {
      secureWarning.hidden = false;
      return;
    }

    try {
      await getStream();
      await listDevices();
      setButtonsState('idle');
    } catch (err) {
      console.error(err);
      alert('Could not access camera/microphone. Please check permissions and device availability.');
    }
  }

  // Event listeners
  startBtn.addEventListener('click', startRecording);
  pauseBtn.addEventListener('click', pauseRecording);
  resumeBtn.addEventListener('click', resumeRecording);
  stopBtn.addEventListener('click', stopRecording);
  muteBtn.addEventListener('click', toggleMute);
  cameraToggleBtn.addEventListener('click', toggleCamera);
  newRecordingBtn.addEventListener('click', newRecording);
  refreshDevicesBtn.addEventListener('click', listDevices);
  cameraSelect.addEventListener('change', getStream);
  micSelect.addEventListener('change', getStream);

  window.addEventListener('beforeunload', () => stopStreamTracks(currentStream));

  // Init
  initialize();
})();


