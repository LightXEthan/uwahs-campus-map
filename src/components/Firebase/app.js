
const pointsList = document.querySelector('#textoutput');

const config = {
    apiKey: "AIzaSyBAHZwqZNKNXw8VqOFgBL0gColIn4NzefE",
    authDomain: "map-app-test-8d1f6.firebaseapp.com",
    projectId: "map-app-test-8d1f6"
};

firebase.initializeApp(config);

const db = firebase.firestore();
db.settings({timestampsInSnapshots: true});

// create element and render points
function renderCafe(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let coords = document.createElement('span');

    li.setAttribute('data-id', doc.id)
    name.textContent = doc.data().name;
    coords.textContent = doc.data().value;

    li.appendChild(name);
    li.appendChild(coords);
    
    textoutput.appendChild(li);
}

// returns each document in the collection
db.collection("points").get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        renderCafe(doc)
    })
});
