import React, { Component } from 'react';
import firebase from "./";

class Firestore extends Component {
    renderCafe(doc) {
        let li = document.createElement('li');
        let name = document.createElement('span');
        let coords = document.createElement('span');
      
        li.setAttribute('data-id', doc.id);
        name.textContent = doc.data().name;
        coords.textContent = doc.data().value;
      
        li.appendChild(name);
        li.appendChild(coords);
        
        textoutput.appendChild(li);
    }
    
    getpoints(db) {
        db.collection("points").get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                console.log(doc.data())
                this.renderCafe(doc)
            })
        });
    }

    render() {
        const db = firebase.firestore();
        db.settings({timestampsInSnapshots: true});
        const pointsList = document.querySelector('#textoutput');
        this.getpoints(db);
        return (
            <p>tesT</p>
        )
    }
}

export default Firestore;

