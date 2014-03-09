var http = require("http"),
    fs = require('fs'),
    url = require("url");
 
var port = 8088;

var server = http.createServer(function (request, response) {
 
    var uri = url.parse(request.url).pathname;
    var filename = ""
    var routerr = request.url.split("/");

    switch(uri) {
        case '/':
            response.writeHead(200, {
                'Access-Control-Allow-Origin' : '*'
            });

            response.write("Nothing Here");
            response.end();

            break;
        case '/get':
            response.writeHead(200, {
                'Access-Control-Allow-Origin' : '*'
            });

            filename = '../xml/PageTemplatePortfolio.xml';

            fs.readFile(filename, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        "Content-Type": "text/plain"
                    });
                    response.write(err + "\n");
                    response.end();
                    return;
                }
                
                response.writeHead(200, {
                    'Access-Control-Allow-Origin' : '*'
                });

                response.write(file, "binary");
                response.end();
            });

            break;
        case '/save':
            response.writeHead(200, {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type, Accept'
            });

            response.write("display edit");
            console.log(request.url);
            response.end();
            break;
        default:
            response.writeHead(404, {
                "Content-Type": "text/plain"
            });

            response.write("oh dear, 404");
            response.end();
    }





/* console.log(request.url + " -XXX- " + url.parse(request.url).pathname.split('/')[0]);

    libpath.exists(filename, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                "Content-Type": "text/plain"
            });
            response.write("404 Not Found\n");
            response.end();
            return;
        }
 
        if (fs.statSync(filename).isDirectory()) {
            filename += '/xml/PageTemplatePortfolio.xml';
        }
 
        fs.readFile(filename, "binary", function (err, file) {
            if (err) {
                response.writeHead(500, {
                    "Content-Type": "text/plain"
                });
                response.write(err + "\n");
                response.end();
                return;
            }
            
            response.writeHead(200, {
                'Access-Control-Allow-Origin' : '*'
            });

            response.write(file, "binary");
            response.end();
        });
    });*/
});

server.listen(port);