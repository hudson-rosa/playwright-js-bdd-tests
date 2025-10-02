#!/bin/bash
set -e

# RUN THIS FILE WITH THE COMMAND:  ./triggers/installation/install_node.sh

echo "_____________________________________"
echo "🎭 NODE RESOURCES ⚡"
echo "-------------------------------------"

echo "------> Installing Node > 22..."
brew unlink node
brew update
brew install node@v22
brew link --overwrite --force node@22
# brew unlink node@20 && brew link --force node@22
echo "✅ Installation done."

# export LDFLAGS="-L/opt/homebrew/opt/node@22/lib"
# export CPPFLAGS="-I/opt/homebrew/opt/node@22/include"
echo 'export PATH="/opt/homebrew/opt/node@22/bin:$PATH"' >> ~/.zshrc
echo "✅ Environment variables exported."

echo "✅ All done."