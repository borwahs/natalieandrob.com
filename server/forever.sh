#!/bin/bash
BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "Base directory [$BASE_DIR]"

NODE_MODULES_DIR="node_modules"
FOREVER_DIR="forever"
BIN_DIR="bin"
FOREVER_EXECUTABLE="forever"

FOREVER_PATH=$BASE_DIR/$NODE_MODULES_DIR/$FOREVER_DIR/$BIN_DIR/$FOREVER_EXECUTABLE

# Stop any existing processes
$FOREVER_PATH stopall

$FOREVER_PATH $BASE_DIR/server.js