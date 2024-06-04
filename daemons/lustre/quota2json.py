import re
import sys
import json

data = sys.stdin.read()

lines = data.strip().split("\n")

headers = None
category = None
output = {}

for line in lines:
    if not headers:
        # One of the three headers
        headers = line.split()
        category = headers[0].lower()
        output[category] = {}
        continue

    if not line:
        # empty line = separation between datasets
        headers = None
        category = None
        continue

    values = re.split(r"\s{2,}", line.strip())
    name = values[0]

    output[category][name] = {
        header: (int(value) if value.isdigit() else value)
        for header, value in zip(headers, values)
        if values not in ["-", ""]
    }

json_output = json.dumps(output, indent=2)
print(json_output)
