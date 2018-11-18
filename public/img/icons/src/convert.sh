#!/bin/bash

set -e -u

toPNG(){
	size="$1"
	source="$2"
	destination="$3"

	inkscape -z -e "$destination" -w "$size" -h "$size" "$source"
}

srcsvg=mainsim-logo.svg

toPNG 128 $srcsvg mainsim-logo.png

toPNG 192 $srcsvg ../android-chrome-192x192.png
toPNG 512 $srcsvg ../android-chrome-512x512.png
toPNG 120 $srcsvg ../apple-touch-icon-120x120.png
toPNG 152 $srcsvg ../apple-touch-icon-152x152.png
toPNG 180 $srcsvg ../apple-touch-icon-180x180.png
toPNG 60 $srcsvg ../apple-touch-icon-60x60.png
toPNG 76 $srcsvg ../apple-touch-icon-76x76.png
toPNG 180 $srcsvg ../apple-touch-icon.png
toPNG 16 $srcsvg ../favicon-16x16.png
toPNG 32 $srcsvg ../favicon-32x32.png
toPNG 144 $srcsvg ../msapplication-icon-144x144.png
toPNG 150 $srcsvg ../mstile-150x150.png

convert -verbose -scale 16x16 $srcsvg ../../../favicon.ico

cp $srcsvg ../safari-pinned-tab.svg
