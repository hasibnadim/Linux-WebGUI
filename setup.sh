#!/bin/bash
echo "Project setup started..."
# check nodejs
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed, please first install node and pnpm (Recommended node v20.11.0)"
    read -p "Press [Enter] to continue..."
    exit 1;
else
    echo "Node.js is installed"
fi

# check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "pnpm is not installed, please first setup pnpm"
    read -p "Press [Enter] to continue..."
    exit 1;
else
    echo "pnpm is installed"
fi

# check pkg
if ! command -v pkg &> /dev/null; then
    echo "Installing pkg globally"
    npm i -g pkg
else
    echo "pkg is installed"
fi

echo "Installing node package"
pnpm i

# check has .env file exist
if [ ! -f .env ]; then
   node scripts/copy_env.js setup
else
    echo ".env file exists"
fi

echo "Linux WebGUI setup complete!"

# wait for user input
read -p "Press [Enter] to continue..."