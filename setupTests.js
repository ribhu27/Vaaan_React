const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
app.use(cors());
const port = 7070;


app.get('/Recordings', (req, res) => {
    console.log('reqestiong cameras data....')
    var folderPath = ".."+ req.url
    fs.readdir("/dockerized-node",(err,files)=>{
      if (err) {
            console.log('Error getting directory information.'+err);
        }
        
        console.log(files);
    });
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.log('Error getting directory information.'+err);
            
            res.status(500).send('Error getting directory information.'+err);
            return;
        }
        
        res.send(files);
    });
});
app.get('/Recordings/:folderPath', (req, res) => {
    console.log('requesting recordings data...')
    var folderPath = ".."+  req.url
    var folderPath2 = "../Recordings2/"+req.params.folderPath
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.log('Error getting directory information.');
            res.status(500).send('Error getting directory information.'+err);
        } else {
            fs.readdir(folderPath2, (err, files2) => {
                if (err) {
                    console.log('Error getting directory information.');
                    // res.status(500).send('Error getting directory information.'+err);
                } else {
                    res.send([...files,...files2]);
                }
            });
            res.send(files);
        }
    });
});

app.get('/Recordings/:folderPath/:videoPath', function(req, res) {
    console.log('reqestiong video....'+req.url)

    const range = req.headers.range;
    if (!range) {
      res.status(400).send('Range header is required');
    }
  
    var videoPath = ".."+req.url;
    const videoPath2 = "../Recordings2/"+req.params.folderPath+"/"+req.params.videoPath
    const videoSize2 = fs.statSync(videoPath2).size;
    var videoSize = fs.statSync(videoPath).size;
    if(!videoSize || videoSize == undefined){
        videoPath = videoPath2
        videoSize = videoSize2
    }
  
    // Parse Range header
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };
  
    // Send the partial content response
    res.writeHead(206, headers);
  
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
  });
  
  app.get('*', function(request, response) {
    console.log('request starting...');
    var filePath = './server' + request.url;
    console.log(filePath)
    fs.readFile(filePath, function(error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                console.log("404 Not found")
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(404, { 'Access-Control-Allow-Origin': '*' });
                    response.end(content, 'utf-8');
                });
            } else {
                console.log("Sorry, check with the site admin for error: ")
                response.writeHead(500, { 'Access-Control-Allow-Origin': '*' });
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            response.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
            response.end(content, 'utf-8');
        }
    });
});