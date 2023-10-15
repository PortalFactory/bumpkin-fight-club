# Bumpkin Fight Club

Community island for [Sunflower Land](https://sunflower-land.com/)

## Server

- Setup mongodb
- Run `npm i` to install packages
- Duplicate `.env.sample` file with `.env` name and fill variable values
- Run `npm run start` to start the server

## Client

- Run `npm i` to install packages
- Duplicate `.env.sample` file with `.env` name and fill variable values
- Copy [Sunnyside World](https://danieldiggle.itch.io/sunnyside) tileset to `/client/public/tileset.png`
- Run `npm run dev` to start the client

## SFL Client

### Local

- Clone [SFL repo](https://github.com/sunflower-land/sunflower-land)
- Run `yarn` to install packages
- Run `yarn dev` to start the client
- Open http://localhost:3000/#/community-tools page
- Enter client URL(http://localhost:8000)

### Testnet

- Install Metamask(or any other) wallet extension
- Switch to Mumbai Polygon network
- Open https://sunflower-land.com/testnet page and log in
- Change url to https://sunflower-land.com/testnet/#/community-tools
- Enter client URL(http://localhost:8000)

## Based on

- Client: https://github.com/0xSacul/valoria-isle
- Server: https://github.com/0xSacul/sacul-community-island-server

## Tiled

- Export map as `map.json` to `client/public` folder
- Open exported file and replace `tilesets` with value from `/tiled/tilesets.json`
