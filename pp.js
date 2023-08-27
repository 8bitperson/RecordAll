const recordButton = document.getElementById('recordingButton');
const recordedAudio = document.getElementById('recordedAudio');
const audio = document.getElementById('recordedAudio');
const downloadLink = document.getElementById('downloadLink');
const downloadLinkMp3 = document.getElementById('downloadLinkMp3');

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
                recordedChunks = [];
                recordedAudio.src = URL.createObjectURL(wavBlob);
                createDownloadLink(wavBlob, 'recorded_audio.wav');
                
                const mp3Blob = new Blob(recordedChunks, { type: 'audio/mpeg-3' });
                recordedChunks = [];
                audio.src = URL.createObjectURL(mp3Blob);
                createmp3DownloadLink(mp3Blob, 'recorded_audio.mp3');
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

function createDownloadLink(blob) {
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'recorded_audio.wav';
    downloadLink.style.display = 'block';
    console.log(blob)
}
function createmp3DownloadLink(bolb){
    downloadLinkMp3.href = URL.createObjectURL(blob);
    downloadLinkMp3.download = 'recorded_audio.mp3';
    downloadLinkMp3.style.display = 'block';
    console.log(bolb)
}
recordButton.disabled = false;
