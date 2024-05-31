#!/bin/bash

set -e -u

toPNG() {
	size="$1"
	source="$2"
	destination="$3"

	convert "$source" -verbose -trim +repage -resize ${size}x${size} "$destination"
}

srcimg=nextsim-logo-original.png

toPNG 128 $srcimg nextsim-logo.png

toPNG 192 $srcimg ../android-chrome-192x192.png
toPNG 512 $srcimg ../android-chrome-512x512.png
toPNG 120 $srcimg ../apple-touch-icon-120x120.png
toPNG 152 $srcimg ../apple-touch-icon-152x152.png
toPNG 180 $srcimg ../apple-touch-icon-180x180.png
toPNG 60 $srcimg ../apple-touch-icon-60x60.png
toPNG 76 $srcimg ../apple-touch-icon-76x76.png
toPNG 180 $srcimg ../apple-touch-icon.png
toPNG 16 $srcimg ../favicon-16x16.png
toPNG 32 $srcimg ../favicon-32x32.png
toPNG 144 $srcimg ../msapplication-icon-144x144.png
toPNG 150 $srcimg ../mstile-150x150.png

convert -verbose -scale 16x16 $srcimg ../../../favicon.ico

# cp $srcimg ../safari-pinned-tab.svg
