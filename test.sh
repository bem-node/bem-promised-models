#!/bin/bash

PHANTOM='./node_modules/mocha-phantomjs/bin/mocha-phantomjs http://127.0.0.1:3000/ '
BEMNODE='node test.app/app/app.server.js --socket 3000'

function checkfail {
    EXIT_CODE=$1
    if [ $EXIT_CODE -gt 0 ]; then
       echo exit code $EXIT_CODE
       killall node 2>/dev/null
       exit $EXIT_CODE;
    fi
}

killall node 2>/dev/null
node lib/browserify.js
$BEMNODE & $PHANTOM
checkfail $?
