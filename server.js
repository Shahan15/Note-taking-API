const fs = require('fs');
const http = require('http');

/* 
GOAL:
Building a Mini REST API (No Frontend) that:

Listens for requests (like "give me all notes" or "save this new note")

Reads/writes data to a local file (notes.json)

Responds with JSON data

*/

const notes = fs.readFileSync('notes.json','utf-8');
const notesToObject = JSON.parse(notes);
let notesToString = JSON.stringify(notesToObject)


//here we create the server 
const server = http.createServer((req, res) => {
    const pathName = req.url;
    //we have to listen to a GET request --> this is fetching a resource
    if(pathName === '/'){
        res.end('this is the root')
    }

    if(req.method === "GET" && pathName === "/notes"){
        res.writeHead(200,{'content-type' : 'application/json'})
        res.end(notesToString);
    }
});

server.listen(8000,'127.0.0.1',()=>{
    console.log("listening to server on port 8000") 
})