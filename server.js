const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const loadEntries = () => {
    if(fs.existsSync('./notes.json')) {
        return JSON.parse(fs.readFileSync('./notes.json','utf-8'));
    } else {
        console.log("file not found");
        return [];
    }
}

const saveEntries = (entry) => {
    fs.writeFileSync('./notes.json', JSON.stringify(entry, null, 2));
}

const server = http.createServer((req, res) => {
    
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    console.log(`${req.url} ${req.method} ${pathname}` ,parsedUrl);

    if (req.url === '/' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'public', 'index.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>Server Error</h1>');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
        return;
    }

    const extType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript'
    };
    
    const staticPath = path.join(__dirname, 'public');
    
    const ext = path.extname(pathname);
    const staticFile = path.join(staticPath, pathname);
    
    if (ext && fs.existsSync(staticFile)) {
        fs.readFile(staticFile, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server error');
            } else {
                res.writeHead(200, { 'Content-Type': extType[ext] || 'text/plain' });
                res.end(data);
            }
        });
        return;
    }    
    
    switch(req.method) {
        case 'GET':
            if(pathname.startsWith('/api/notes/')) {
                const id = pathname.split('/')[3];
                const notes = loadEntries();
                const note = notes.find((note) => note.id == id);
                res.writeHead(200, {'content-type':'application/json'});
                res.end(JSON.stringify(note));
            } else if(pathname === '/api/notes') {
                const notes = loadEntries();
                res.writeHead(200, {'content-type':'application/json'});
                res.end(JSON.stringify(notes));
            } else {
                res.writeHead(404, {'content-type':'application/json'});
                res.end(JSON.stringify({error: 'Not Found'}));
            }
            break;
        case 'POST':
            if(req.url === '/api/notes') {
                let body = "";
                req.on('data', chunk => {
                    body += chunk;
                });
                
                req.on('end', () => {
                    const newNote = JSON.parse(body);
                    const notes = loadEntries();
                    newNote.id = notes.length ? notes[notes.length - 1].id + 1 : 1;
                    notes.push(newNote);
                    saveEntries(notes);
                    res.writeHead(201, {'content-type':'application/json'});
                    res.end(JSON.stringify(newNote));
                });
            } else {
                res.writeHead(404, {'content-type':'application/json'});
                res.end(JSON.stringify({error: 'Not Found'}));
            }
            break;
        case 'PUT': 
            if(pathname.startsWith('/api/notes/')) {
                const id = pathname.split('/')[3];
                let body = "";

                req.on('data', chunk => {
                    body += chunk;
                });

                req.on('end', () => {
                    const notes = loadEntries();
                    const updateNote = JSON.parse(body);
                    const noteIndex = notes.findIndex((note) => note.id == id);

                    if(noteIndex !== -1) {
                        updateNote.id = notes[noteIndex].id; // keep the same ID as before
                        notes[noteIndex] = updateNote;
                    }
                    
                    saveEntries(notes);
                    res.writeHead(200, {'content-type':'application/json'});
                    res.end(JSON.stringify(updateNote));
                });
            } else {
                res.writeHead(404, {'content-type':'application/json'});
                res.end(JSON.stringify({error: 'Not Found'}));
            }
            break;
        case 'DELETE':
            if(pathname.startsWith('/api/notes/')) {
                const id = pathname.split('/')[3];
                const notes = loadEntries();
                const noteIndex = notes.findIndex((note) => note.id == id);
                
                if(noteIndex !== -1) {
                    notes.splice(noteIndex, 1);
                    saveEntries(notes);
                    res.writeHead(200, {'content-type':'application/json'});
                    res.end();
                } else {
                    res.writeHead(404, {'content-type':'application/json'});
                    res.end(JSON.stringify({error: 'Note not found'}));
                }
            } else {
                res.writeHead(404, {'content-type':'application/json'});
                res.end(JSON.stringify({error: 'Not Found'}));
            }
            break;
        default:
            res.writeHead(404, {'content-type':'application/json'});
            res.end(JSON.stringify({error: 'Not Found'}));
            break;
    };
});

server.listen(3000, 'localhost', () => {
    console.log("Server is running on port 3000");
});