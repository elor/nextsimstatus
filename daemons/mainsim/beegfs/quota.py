#!/usr/bin/env python2

import re
import csv
from StringIO import StringIO

from run_command import run_command


exit_code, raw_csv, error = run_command(['beegfs-ctl', '--getquota', '--uid', '--range', '500', '1999', '--csv'])

csv_lines = '\n'.join([line for line in raw_csv.split('\n') if ',' in line]).replace(',size,hard,files,hard', ',bytes,bytes_hard_quota,files,files_hard_quota')

reader = csv.DictReader(StringIO(csv_lines))
csv_data = dict([[row['name'], row] for row in reader])

import json

print json.dumps(csv_data, indent=2)

