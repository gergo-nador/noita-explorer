#!/usr/bin/env python

# Inspired by https://gist.github.com/jtangelder/e445e9a7f5e31c220be6
# https://gist.github.com/iktakahiro/2c48962561ea724f1e9d
# Python3 http.server for Single Page Application

import urllib.parse
import http.server
import socketserver
import re
from pathlib import Path

HOST = ('0.0.0.0', 8000)
pattern = re.compile('.png|.jpg|.jpeg|.js|.css|.ico|.gif|.svg', re.IGNORECASE)


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        url_parts = urllib.parse.urlparse(self.path)
        request_path = Path(url_parts.path.strip("/"))
        ext = request_path.suffix

        # Handle root path ("/") directly
        if self.path in ('', '/'):
            self.path = '/index.html'
            return http.server.SimpleHTTPRequestHandler.do_GET(self)

        if request_path.is_file() or pattern.match(ext):
            return http.server.SimpleHTTPRequestHandler.do_GET(self)

        # If the path is a file request for a static asset, serve it as is
        if pattern.match(str(request_path)):
            return http.server.SimpleHTTPRequestHandler.do_GET(self)

        # Try /path/to/page.html
        html_file = request_path.with_suffix('.html')
        if html_file.is_file():
            self.path = '/' + str(html_file)
            return http.server.SimpleHTTPRequestHandler.do_GET(self)

        # Try /path/to/page/index.html
        index_file = request_path / 'index.html'
        if index_file.is_file():
            self.path = '/' + str(index_file)
            return http.server.SimpleHTTPRequestHandler.do_GET(self)

        # Default fallback
        self.path = '/index.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)


httpd = socketserver.TCPServer(HOST, Handler)
print('Up and running on port 8000')
httpd.serve_forever()