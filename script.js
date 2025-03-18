// Підключення до Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBeNVkrZpo1f5Bi7NdrlXqa5agtoK66wb8",
  authDomain: "chatsite-88697.firebaseapp.com",
  projectId: "chatsite-88697",
  storageBucket: "chatsite-88697.firebasestorage.app",
  messagingSenderId: "72786894441",
  appId: "1:72786894441:web:b54ff67662b34aa2424cf8",
  measurementId: "G-CJ56Q2SBWW"
};

// Ініціалізація Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Отримуємо чат з URL
const params = new URLSearchParams(window.location.search);
const room = params.get('room') || "obgovori";
document.getElementById('room-name').innerText = room === "stanov" ? "Становясь волшебніцей" : "Обговори";

// Відображення повідомлень
const chatDiv = document.getElementById('chat');
db.collection(room).orderBy("timestamp").onSnapshot(snapshot => {
    chatDiv.innerHTML = "";
    snapshot.forEach(doc => {
        const data = doc.data();
        const msg = document.createElement("p");
        msg.textContent = data.text;
        chatDiv.appendChild(msg);
    });
});

// Функція для відправки повідомлень
function sendMessage() {
    const messageInput = document.getElementById('message');
    const text = messageInput.value.trim();
    if (text === "") return;

    db.collection(room).add({
        text: text,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    messageInput.value = "";
}

// Функція для завантаження фото
function uploadImage() {
    const fileInput = document.getElementById('image');
    const file = fileInput.files[0];
    if (!file) return;

    const storageRef = storage.ref();
    const fileRef = storageRef.child('images/' + file.name);
    
    fileRef.put(file).then(() => {
        fileRef.getDownloadURL().then(url => {
            db.collection(room).add({
                text: url,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        });
    });
}
