# fiveinarow
Five in a row with socket.io

Dependent on https://github.com/Saikyun/rule_checker

The actual cool part is that you can write rules once and they're applied on both the client and the server. This leads to users getting nice error messages immediately if they play nice, but a meanie bypassing the client rules by sending packets to the server won't get their way either.

Here you can see some rules: https://github.com/Saikyun/fiveinarow/blob/master/game_specific/rules.js

npm start to start the server

Two players need to connect for a game to start. If you're alone two separate browser windows works fine.
