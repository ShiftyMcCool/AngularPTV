var http = require("http"),
    fs = require('fs'),
    url = require("url");
 
var port = 8088;

var formatXml = function(xml) {
  var formatted = '';
  var reg = /(>)(<)(\/*)/g;
  xml = xml.replace(reg, '$1\r\n$2$3');
  var pad = 0;
  var arrXml = xml.split('\r\n')
  for(var x in arrXml ) {
      var indent = 0;
      if (arrXml[x].match( /.+<\/\w[^>]*>$/ )) {
          indent = 0;
      } else if (arrXml[x].match( /^<\/\w/ )) {
          if (pad != 0) {
              pad -= 1;
          }
      } else if (arrXml[x].match( /^<\w[^>]*[^\/]>.*$/ )) {
          indent = 1;
      } else {
          indent = 0;
      }

      var padding = '';
      for (var i = 0; i < pad; i++) {
          padding += '  ';
      }

      formatted += padding + arrXml[x] + '\r\n';
      pad += indent;
  }

  return formatted;
};

var server = http.createServer(function (request, response) {
 
    var uri = url.parse(request.url, true);
    var filename = '../xml/PageTemplatePortfolio.xml'
    var routerr = request.url.split("/");

    switch(uri.pathname) {
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

            fs.readFile(filename, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        "Content-Type": "text/plain"
                    });
                    response.write(err + "\n");
                    console.log(err);
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
            fs.writeFile(filename, formatXml(uri.query.portfolio), function(err) {
                if(err) {
                    response.writeHead(500, {
                        "Content-Type": "text/plain"
                    });
                    response.write(err + "\n");
                    console.log(err);
                    response.end();
                    return;
                } else {
                    console.log("The file was saved!");
                }
            });

            response.writeHead(200, {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type, Accept'
            });

            response.write("Saved!");
            response.end();
            break;
        default:
            response.writeHead(404, {
                "Content-Type": "text/plain"
            });

            response.write("404 not found");
            response.end();
    }
});

server.listen(port);