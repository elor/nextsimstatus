#!/bin/bash

echo '['
scontrol show node --oneline \
	| while read line; do
		echo '{'
		grep -Po '\b[A-Z][A-Za-z]*=.*?(?= \b[A-Z][A-Za-z]*=|$)' <<< "$line" \
		| sed -r -e 's/^([^=]+)=(.*)$/"\1": "\2",/' -e '$s/,$//'
		echo '},'
	done | sed -e '$s/,$//'
echo ']'
