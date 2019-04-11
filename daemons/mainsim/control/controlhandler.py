import json
import cgi
import requests
from BaseHTTPServer import HTTPServer, BaseHTTPRequestHandler

import config
import nodes
import jobs

import urllib3
urllib3.disable_warnings()


class ControlHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/control/nodes':
            self.handle_nodes()
        elif self.path == '/control/jobs':
            self.handle_jobs()
        else:
            self.send_error(404)

    def handle_jobs(self):
        if not self.logged_in():
            return

        if self.is_admin():
            user = config.ADMIN_GROUP
        else:
            user = self.logged_in()

        try:
            jobs.test(self.jobs, user)
        except OSError, err:
            self.send_error(
                500, 'OSError: {} (while testing job definition `{}`'.format(err, self.jobs))
            return
        except RuntimeError, err:
            self.send_error(
                500, 'Invalid job query: `{}`. {}'.format(self.jobs, err))
            return

        try:
            output = jobs.control(self.action, self.jobs)
        except OSError, err:
            command_str = ' '.join(jobs.command(self.action, self.jobs))
            self.send_error(
                500, 'OSError: {} (while running `{}`)'.format(err, command_str))
            return
        except RuntimeError, err:
            command_str = ' '.join(jobs.command(self.action, self.jobs))
            self.send_error(
                500, 'Error while running `{}`: {}'.format(command_str, err))
            return

        self.send_response(200)
        self.end_headers()
        self.wfile.write(output)

    def handle_nodes(self):
        if not self.is_admin():
            return

        try:
            nodes.test(self.nodes)
        except OSError, err:
            self.send_error(500,
                            'OSError: {} (while testing node definition `{}`'.format(
                                err, self.nodes)
                            )
            return
        except RuntimeError, err:
            self.send_error(
                500, 'Invalid node definition: `{}`. {}'.format(self.nodes, err))
            return

        try:
            output = nodes.control(self.action, self.nodes)
        except OSError, err:
            command_str = ' '.join(nodes.command(self.action, self.nodes))
            self.send_error(
                500, 'OSError: {} (while running `{}`)'.format(err, command_str))
            return
        except RuntimeError, err:
            command_str = ' '.join(nodes.command(self.action, self.nodes))
            self.send_error(
                500, 'Error while running `{}`: {}'.format(command_str, err))
            return

        self.send_response(200)
        self.end_headers()
        self.wfile.write(output)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers',
                         'X-Requested-With, Content-Type')
        self.end_headers()

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        BaseHTTPRequestHandler.end_headers(self)

    def is_admin(self):
        authentication = self.authenticate()
        if not authentication:
            return False

        if not config.ADMIN_GROUP in authentication['decoded']['groups']:
            self.send_error(403, 'You are no simadmin')
            return False

        return True

    def logged_in(self):
        authentication = self.authenticate()
        if not authentication:
            self.send_error(403, 'You are not logged in')
            return False

        return authentication['decoded']['login']

    def authenticate(self):
        if self._authentication:
            return self._authentication
        authentication = self.auth_token
        if not authentication:
            self.send_error(403, 'No authentication data sent')
            return None

        data = {'token': authentication}
        response = requests.post(config.AUTH_URL, data=data, verify=False)

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

        self._authentication = authentication
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
        if 'nodes' in self.params:
            return self.params['nodes']
        return None

    @property
    def jobs(self):
        if 'jobs' in self.params:
            return self.params['jobs']
        return None

    error_message_format = 'Error %(code)d (%(explain)s): "%(message)s"'
    error_content_type = 'text/plain'
    _params = None
    _authentication = None
