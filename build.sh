#!/bin/sh

OUTPUT_DIR="webflow"

mkdir "$OUTPUT_DIR"

mustache script.min.js > "$OUTPUT_DIR"/script.min.js
