#!/bin/bash
scriptPath="$1"
envName="$2"

cd "$(dirname "$0")"

source ./$envName/bin/activate

python $scriptPath || exit 1


