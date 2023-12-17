const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

// firebase
// Import the functions you need from the SDKs you need

const { initializeApp } = require("firebase/app");
const {
  getFirebaseApp,
  doc,
  setDoc,
  getFirestore,
  deleteDoc
} = require("firebase/firestore");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNiObjzeOHnjUXDRFOmg4421kB3fCTIpE",
  authDomain: "fb-server-1c3ec.firebaseapp.com",
  projectId: "fb-server-1c3ec",
  storageBucket: "fb-server-1c3ec.appspot.com",
  messagingSenderId: "527357242107",
  appId: "1:527357242107:web:934e337b037fe07609de5e"
};

// Initialize Firebase
const appfb = initializeApp(firebaseConfig);

let firestoredb = getFirestore();
// firebase ends

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // User connected
  console.log(`user connected : ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("disconnect", () => {

// const uploadProcessedData = async (peeriddata) => {
//   const datatoupload = {
//     isOnline: false,
//   };
//   try {
//     const document = doc(firestoredb, "userstatus", socket.id);
//     let dataUpdated = await setDoc(document, datatoupload);
//     console.log(dataUpdated);
//   } catch (error) {
//     console.log("Error firebase :" + error);
//   }
// };

//     uploadProcessedData();
    const docRef = doc(firestoredb, "userstatus", socket.id);

    deleteDoc(docRef)
      .then(() => {
        console.log("Entire Document has been deleted successfully.");
      })
      .catch((error) => {
        console.log(error);
      });


    console.log("User Disconnected  :" + socket.id); // undefined
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  // mouse click left
  socket.on("mouseclickl", (data) => {
    socket.to(data.room).volatile.emit("mouse_clickl_recive", data);
  });

  //mouse click right
  socket.on("mouseclickr", (data) => {
    socket.to(data.room).volatile.emit("mouse_clickr_recive", data);
  });

  //mouse move event
  socket.on("mousecord", (data) => {
    socket.to(data.room).volatile.emit("mouse_cord", data);
  });

  //mouse toggler
  socket.on("mousetogg", (data) => {
    socket.to(data.room).volatile.emit("mousetogg_send", data);
  });

  // keyboard section starts here

  // QWERTY
  socket.on("qwert_keys", (data) => {
    socket.to(data.room).volatile.emit("qwerty_recieve", data);
  });



 // screenshot event
 socket.on("screenshot", (data) => {
    socket.to(data.room).volatile.emit("recive_ssfire", data);
  });

   // keytoggler
 socket.on("keytoggler", (data) => {
    socket.to(data.room).volatile.emit("recive_keytoggles", data);
  });


     // mon on
 socket.on("monoff", (data) => {
    socket.to(data.room).volatile.emit("recive_mononoff", data);
  });

       // mon off
 socket.on("monon", (data) => {
    socket.to(data.room).volatile.emit("recive_monon", data);
  });


  // ask for screen size
socket.on("askscr", (data) => {
    socket.to(data.room).volatile.emit("recive_scrask", data);
  });

    // send screen size
 socket.on("sendscreen", (data) => {
    socket.to(data.room).emit("recive_sendscreen", data);
  });

});

 

server.listen(3001, () => {
  console.log("Server is running");
});
