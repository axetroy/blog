#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os

cwd = os.getcwd()

pkgPath = os.path.join(cwd, 'package.json')

with open(pkgPath, 'r') as f:
    pkgRaw = f.read()

    pkg = json.loads(pkgRaw)

    # homepage = pkg["homepage"]
    homepage = "axetroy.xyz"

    if homepage:
        with open(os.path.join(cwd, 'build', 'CNAME'), 'w') as cnameFile:
            cnameFile.write(homepage)
