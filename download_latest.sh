#!/bin/bash

# Variables
REPO="macolby14/uvindex-electron"
ARCH="amd64"

# Fetch the latest release information
latest_release=$(curl -s https://api.github.com/repos/$REPO/releases/latest)

# Extract the tag name
tag_name=$(echo $latest_release | jq -r '.tag_name')

# Find the .deb asset for the specified architecture
deb_url=$(echo $latest_release | jq -r ".assets[] | select(.name | test(\"$ARCH.*deb\")) | .browser_download_url")

# Check if the .deb URL was found
if [ -z "$deb_url" ]; then
  echo "No .deb asset found for architecture $ARCH"
  exit 1
fi

# Download the .deb package
wget -O /tmp/package.deb $deb_url

# Install the .deb package
sudo dpkg -i /tmp/package.deb

# Clean up
rm /tmp/package.deb

echo "Installation of $REPO ($tag_name) completed."
