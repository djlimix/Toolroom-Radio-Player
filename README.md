# Toolroom Radio Player

This is a modern player in which you can listen to (almost) any **episode of Toolroom radio** *(hosted by Mark Knight)*

You can download it and use it to listen to the radio show, or you can customise it and make playlists for example. It
is up to you.

Demo of this player is available [here](https://player.limix.eu)

## Install

Download the project by clicking [here](https://github.com/djlimix/Toolroom-Radio-Player/archive/master.zip). Then unzip
it. You need to have PHP installed in order to use this project. If you want to use it using built-in PHP server, open
terminal or command prompt from the root of this project and type this command:

```
php -S localhost:80
```

Now you can open your browser and type **[http://localhost:80](http://localhost:80)**. Keep in mind that seeking
forwards and backwards is not working on PHP built-in server. You should use this together with Apache2.

## Warning

If you want to use this on a Linux-based machine, you need to change specific permissions for the folder ***src***

```
cd src # assuming you are already in the root folder of this project
sudo chown -R $USER:www-data .
sudo find . -type f -exec chmod 664 {} \;   
sudo find . -type d -exec chmod 775 {} \;
sudo chgrp -R www-data src .
sudo chmod -R ug+rwx src .
```