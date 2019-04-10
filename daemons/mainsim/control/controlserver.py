#!/usr/bin/env python

import subprocess
import requests
from BaseHTTPServer import HTTPServer, BaseHTTPRequestHandler
import cgi
import json

import urllib3
urllib3.disable_warnings()

PORT = 18081
HOST = 'localhost'

AUTH_URL = 'https://mainsimweb.etit.tu-chemnitz.de/auth/token/check'

ADMIN_GROUP = 'simadmin'


class MyLittleHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if not self.is_admin():
            return

        command = ['mainsim', self.action, self.nodes]
        command_str = ' '.join(command)
        try:
            return_code = subprocess.call(command)
        except OSError, err:
            self.send_error(
                500,
                "OSError: {} (while running {})".format(err, command_str)
            )
            return

        if return_code:
            self.send_error(
                500,
                'Non-Zero return code when running `{}`'.format(command_str)
            )
            return

        self.send_response(200)
        self.end_headers()
        self.wfile.write('Looks like a success')

    
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        BaseHTTPRequestHandler.end_headers(self)

    def is_admin(self):
        authentication = self.authenticate()
        if not authentication:
            return False

        if not ADMIN_GROUP in authentication['decoded']['groups']:
            self.send_error(403, 'You are no simadmin')
            return False

        return True

    def authenticate(self):
        authentication = self.auth_token
        if not authentication:
            self.send_error(403, 'No authentication data sent')
            return None

        data = {"token": authentication}
        response = requests.post(AUTH_URL, data=data, verify=False)

        status = response.status_code
        content = response.content

        if status != 200:
            self.send_error(status, content)
            return None

        try:
            authentication = json.loads(content)
        except:
            self.send_error(500, 'Could not parse authentication response')
            return None

        if 'valid' not in authentication or not authentication['valid']:
            self.send_error(403, 'Invalid authentication')

        if 'decoded' not in authentication or not authentication['decoded']:
            self.send_error('Authentication is missing information')

        decoded = authentication['decoded']
        for key in ['name', 'groups', 'home', 'login', 'uid']:
            if key not in decoded or not decoded[key]:
                self.send_error('Authentication is missing {} key'.format(key))

        return authentication

    @property
    def params(self):
        if self._params:
            return self._params

        ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
        if ctype == 'multipart/form-data':
            self._params = cgi.parse_multipart(self.rfile, pdict)
        elif ctype == 'application/x-www-form-urlencoded':
            length = int(self.headers.getheader('content-length'))
            self._params = cgi.parse_qs(
                self.rfile.read(length), keep_blank_values=1)
        elif ctype == 'application/json':
            length = int(self.headers.getheader('content-length'))
            self._params = json.loads(self.rfile.read(length))
        else:
            self._params = {}

        return self._params

    @property
    def auth_token(self):
        authentication = None

        if not authentication:
            authentication = self.headers.getheader('authentication')
        if not authentication:
            if 'authentication' in self.params:
                authentication = self.params['authentication']

        return authentication

    @property
    def action(self):
        return self.params['action']

    @property
    def nodes(self):
        return self.params['nodes']

    error_message_format = 'Error %(code)d (%(explain)s): "%(message)s"'
    error_content_type = 'text/plain'
    _params = None


httpd = HTTPServer((HOST, PORT), MyLittleHandler)
print "starting to serve on {}:{}".format(HOST, PORT)
httpd.serve_forever()
