#!/usr/bin/env python2

import re
import json

from run_command import run_command
from sys import argv

IGNORELINES=[
    'lmutil - Copyright',
    'Flexible License Manager status',
    'License server status',
    'Vendor daemon status',
    'snpslmd: UP',
    'pam_lmd: UP',
    'Feature usage info:',
    'vendor_string',
    'floating license',
    'license server UP' 
]

servers = {}

for licfile in argv[1:]:
    code, out, err = run_command(['./lmutil', 'lmstat', '-a', '-c', licfile])
    if code == 0:
        lines = [line for line in [line.strip() for line in out.split('\n')]  if line]
    else:
        line=[]
  
    print
    print '{}:'.format(licfile)
    print

    port, host = licfile.split('@')

    data = {
        'error': err,
        'code': code,
        'licurl': licfile,
        'lichost': host,
        'licport': int(port),
        'features': {}
    }

    lastfeature = None

    for line in lines:
        if any([ignored in line for ignored in IGNORELINES]):
            pass
        elif line.startswith('License file(s) on'):
            match = re.match(r'License file\(s\) on [^:]+:\s*(.*):$', line)
            data['licfile'] = match.group(1)
        elif line.startswith('Users of'):
            match = re.match(r'Users of (\S+):\s+\(Total of (\d+) licenses? issued;\s+Total of (\d+) licenses? in use\)', line)
            if match:
                feature = match.group(1)
                total = int(match.group(2))
                inuse = int(match.group(3))

                if feature not in data['features']:
                    data['features'][feature] = {
                        'feature': feature,
                        'total': 0,
                        'inuse': 0,
                        'free': 0,
                        'versions': [],
                        'users': []
                    }
                    
                data['features'][feature]['total'] += total
                data['features'][feature]['inuse'] += inuse
                data['features'][feature]['free'] += total - inuse
            else:
                error += '\n' + line
        elif re.match('"([^"]+)" (v\S+), vendor: \S+, expiry: (\d{2}-\w{3}-\d{4})$', line):
            match = re.match('"([^"]+)" (v\S+), vendor: \S+, expiry: (\d{2}-\w{3}-\d{4})$', line)
            feature = match.group(1)
            version = match.group(2)
            expiry = match.group(3)

            data['features'][feature]['versions'].append({'version': version, 'expiry': expiry})
            
            lastfeature = feature

        elif re.match('(\S+) (\S+) (\S+) \((v\S+\)) \(.*\), start .*?(, (\d+) licenses)?', line):
            match = re.match('(\S+) (\S+) (\S+) \((v\S+)\) \(.*\), start .*?(, (\d+) licenses|$)', line)

            user = {
                'feature':  lastfeature,
                'user':  match.group(1),
                'node':  match.group(2),
                'tty':  match.group(3),
                'version':  match.group(4),
                'licenses':  match.group(6) if match.group(6) else 1
            }

            data['features'][lastfeature]['users'].append(user)
        else:
            print 'unexpected line: {}'.format(line)

    servers[licfile] = data

print json.dumps(servers, indent=2, sort_keys=True)

