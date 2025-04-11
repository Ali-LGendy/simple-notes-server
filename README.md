# 📝 Simple Notes App (Node.js)

A lightweight notes-taking web app powered by a custom Node.js HTTP server. Add, view, and manage your notes — all stored locally in a JSON file.

![Node.js](https://img.shields.io/badge/Built%20with-Node.js-brightgreen)
![Status](https://img.shields.io/badge/Status-Working-blue)

![Preview Screenshot](https://i.imgur.com/CgF7kWh.png)

> *(Replace the image with your own screenshot link later if you want.)*

## 🔧 Features

- ✅ RESTful API for notes
- ✅ Create and view notes
- ✅ JSON file as a local database
- ✅ Simple frontend with HTML/CSS/JS
- ✅ No frameworks — just Node core modules

## 📁 Folder Structure

TODO_TASK/  ├── public/  
            │       ├── index.html   # Main interface  
            │       ├── script.js    # Frontend logic │ 
            │       └── style.css    # Styling 
            |
            ├── notes.json    # Data file 
            ├── server.js     # Node.js backend 
            ├── package.json  # Project metadata 
            └── README.md


## 🚀 Getting Started

### 1. Clone the repository

git clone https://github.com/Ali-LGendy/simple-notes-app.git cd simple-notes-app


### 2. Run the server

node server.js

### 3. Open in your browser

Visit [http://localhost:3000](http://localhost:3000)

## 📬 API Endpoints

| Method | Route              | Description           |
|--------|--------------------|-----------------------|
| GET    | /api/notes         | Get all notes         |
| GET    | /api/notes/:id     | Get note by ID        |
| POST   | /api/notes         | Create a new note     |
| PUT    | /api/notes/:id     | (Coming Soon)         |
| DELETE | /api/notes/:id     | (Coming Soon)         |

## ✨ Future Improvements

- Add support for editing (`PUT`) and deleting notes (`DELETE`)
- Add error handling and input validation
- Replace JSON with a real database like MongoDB
- Add date/timestamp and note categories
- Host the app online

## 👨‍💻 Author

Made with ❤️ by [Ali Elgendy](https://github.com/Ali-LGendy)