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
const notesToObject = JSON.parse(notes); //returns an array of objects
let notesToString = JSON.stringify(notesToObject);


//We create the server 
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
    
    if(req.method === "POST" && pathName === "/notes"){
        //what is Postman sending? --> it sends a JSON body but sends it in chunks. like a piece of paper ripped in pieces
        //how do we capture this response
        let body = '';


        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end",() => {
            console.log("All Chunks have arrived")
            const newNoteToAdd = JSON.parse(body);
            notesToObject.push(newNoteToAdd);
            console.log("Successfully added new note to notes.json")

            fs.writeFile('notes.json', JSON.stringify(notesToObject), 'utf-8', (err) => {
                if(err){console.log(`error encountered ${err}`)} else{console.log("Notes added successfully")}
            })
        });

        res.writeHead(201,{'Content-Type':'application/json'});
        res.end(JSON.stringify({ status: "success", note: newNoteToAdd }));
    };
});

server.listen(8000,'127.0.0.1',()=>{
    console.log("listening to server on port 8000") 
});