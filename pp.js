const recordButton = document.getElementById('recordingButton');
const recordedAudio = document.getElementById('recordedAudio');
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
                const blob = new Blob(recordedChunks, { type: 'audio/wav' });
                recordedChunks = [];
                recordedAudio.src = URL.createObjectURL(blob);
                createDownloadLink(blob);

                const bolb = new Blob(recordedChunks, { type: 'audio/mp3' });
                recordedChunks = [];
                recordedAudio.src = URL.createObjectURL(bolb);
                createDownloadLink(bolb);
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

function createDownloadLink(blob,bolb) {
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'recorded_audio.wav';
    downloadLink.style.display = 'block';
    console.log(blob)

    downloadLinkMp3.href = URL.createObjectURL(bolb);
    downloadLinkMp3.download = 'recorded_audio.mp3';
    downloadLinkMp3.style.display = 'block';
    console.log(bolb)
}

recordButton.disabled = false;
