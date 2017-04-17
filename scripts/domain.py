#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os

cwd = os.getcwd()

pkgPath = os.path.join(cwd, 'package.json')

with open(pkgPath, 'r') as f:
    str = f.read()
    pkg = json.loads(str)

    config = pkg["config"]

    domain = config["domain"]

    if domain:
        with open(os.path.join(cwd, 'build', 'CNAME'), 'w') as cname:
            cname.write(domain)
