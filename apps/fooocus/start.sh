#!/bin/bash

if [ -d "/app/repositories/Fooocus" ]; then
    python3 main.py --host 0.0.0.0 --port 8888 --base-url http://cervantes-fooocus.flycast --skip-pip --sync-repo skip
else
    python3 main.py --host 0.0.0.0 --port 8888
fi
