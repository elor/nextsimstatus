#!/usr/bin/python3

import re
import json
import subprocess

data = subprocess.run(["nextsim", "quota"], capture_output=True, text=True).stdout
lines = data.strip().split("\n")

headers = None
category = None
output = {}

for line in lines:
    if not headers:
        # One of the three headers
        headers = line.split()
        category = headers[0].lower()
        output[category] = []
        continue

    if not line:
        # empty line = separation between datasets
        headers = None
        category = None
        continue

    values = re.split(r"\s{2,}", line.strip())

    output[category].append(
        {
            header: (int(value) if value.isdigit() else value)
            for header, value in zip(headers, values)
            if value not in ["-", ""]
        }
    )

# Execute df -k /home command to get disk usage in KB
lustre_mounts = [
    line[1]
    for line in (line.split() for line in open("/proc/mounts"))
    if line[2] == "lustre"
]
df_output = subprocess.run(
    ["df", "-k"] + lustre_mounts, capture_output=True, text=True
).stdout
df_lines = df_output.strip().split("\n")

# Parse df output and add it to the 'disk' category
df_headers = df_lines[0].split()
output["df"] = []

for line in df_lines[1:]:
    df_values = line.split()
    mount = df_values[-1]

    disk_info = {}

    for header, value in zip(df_headers, df_values):
        disk_info[header] = int(value) if value.isdigit() else value

    output["df"].append(disk_info)

json_output = json.dumps(output, indent=2)
print(json_output)
