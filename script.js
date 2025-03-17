// Підключення Firebase SDK
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

// Створюємо з'єднання з Firestore (для збереження повідомлень)
const db = firebase.firestore();

// Створюємо з'єднання з Firebase Storage (для завантаження фото)
const storage = firebase.storage();

// Отримуємо параметр кімнати (для вибору чату)
const params = new URLSearchParams(window.location.search);
const room = params.get('room');
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
    const text = messageInput.value;
    if (text.trim() === "") return;

    db.collection(room).add({
        text: text,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    messageInput.value = "";
}

// Функція для завантаження фото в Firebase Storage
function uploadImage(file) {
    const storageRef = storage.ref();
    const fileRef = storageRef.child('images/' + file.name);
    fileRef.put(file).then(() => {
        alert("Фото завантажено!");
    });
}

// Обробка фото в полі input
const imageInput = document.getElementById('image');
imageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        uploadImage(file);
    }
});
