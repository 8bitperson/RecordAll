const recordButton = document.getElementById('recordingButton');
const recordedAudio = document.getElementById('recordedAudio');
const downloadLink = document.getElementById('downloadLink');
const downloadLinkMp3 = document.getElementById('downloadLinkMp3');
const downloadLinkm4a = document.getElementById('downloadLinkm4a');
const downloadWavButton = document.getElementById('downloadWavButton');
const downloadMp3Button = document.getElementById('downloadMp3Button');
const downloadm4aButton = document.getElementById('downloadm4aButton');

let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

recordButton.addEventListener('click', toggleRecording);

function toggleRecording() {
    if (isRecording) {
        stopRecording();
        recordButton.textContent = 'Start Recording';
    } else {
        startRecording();
        recordButton.textContent = 'Stop Recording';
    }
}

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const wavBlob = new Blob(recordedChunks, { type: 'audio/wav' });
                const mp3Blob = new Blob(recordedChunks, { type: 'audio/mp3' });
                const m4aBlob = new Blob(recordedChunks, { type: 'audio/m4a' });

                recordedChunks = [];
                
                recordedAudio.src = URL.createObjectURL(wavBlob);
                createDownloadLink(wavBlob, 'recorded_audio.wav');
                downloadWavButton.style.display = 'block';

                createDownloadLink(mp3Blob, 'recorded_audio.mp3');
                downloadMp3Button.style.display = 'block';

                createDownloadLink(m4aBlob, 'recorded_audio.m4a');
                downloadm4aButton.style.display = 'block';
            };

            mediaRecorder.start();
            isRecording = true;
        })
        .catch(error => {
            console.error('Error accessing microphone:', error);
            alert("Please allow access to your microphone or plug in your microphone")
        });
}

function stopRecording() {
    mediaRecorder.stop();
    isRecording = false;
}

function createDownloadLink(blob, fileName) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.textContent = fileName;

    if (fileName.endsWith('.wav')) {
        downloadLink.innerHTML = ''; // Clear existing link
        downloadLink.appendChild(link);
    } else if (fileName.endsWith('.mp3')) {
        downloadLinkMp3.innerHTML = ''; // Clear existing link
        downloadLinkMp3.appendChild(link);
    } else if (fileName.endsWith('.m4a')) {
        downloadLinkm4a.innerHTML = ''; // Clear existing link
        downloadLinkm4a.appendChild(link);
    }
}

downloadWavButton.addEventListener('click', () => {
    const wavBlob = new Blob(recordedChunks, { type: 'audio/wav' });
    const wavUrl = URL.createObjectURL(wavBlob);
    const wavLink = document.createElement('a');
    wavLink.href = wavUrl;
    wavLink.download = 'recorded_audio.wav';
    wavLink.click();
});

downloadm4aButton.addEventListener('click', () => {
    const m4aBlob = new Blob(recordedChunks, { type: 'audio/m4a' });
    const m4aUrl = URL.createObjectURL(m4aBlob);
    const m4aLink = document.createElement('a');
    m4aLink.href = m4aUrl;
    m4aLink.download = 'recorded_audio.m4a';
    m4aLink.click();
});

downloadMp3Button.addEventListener('click', () => {
    const mp3Blob = new Blob(recordedChunks, { type: 'audio/mp3' });
    const mp3Url = URL.createObjectURL(mp3Blob);
    const mp3Link = document.createElement('a');
    mp3Link.href = mp3Url;
    mp3Link.download = 'recorded_audio.mp3';
    mp3Link.click();
});

recordButton.disabled = false;
