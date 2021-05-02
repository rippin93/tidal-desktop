#!/usr/bin/env sh

sudo rm -rf "$HOME/.local/share/TIDAL-linux-x64"
mkdir -p "$HOME/.local/share"
cp -R build/TIDAL-linux-x64 "$HOME/.local/share"
sudo chown root:root "$HOME/.local/share/TIDAL-linux-x64/chrome-sandbox"
sudo chmod 4755 "$HOME/.local/share/TIDAL-linux-x64/chrome-sandbox"
mkdir -p "$HOME/.local/share/applications"
cp tidal.desktop "$HOME/.local/share/applications"
