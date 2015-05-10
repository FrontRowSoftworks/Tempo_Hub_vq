# Tempo_Hub_vq
Read this before your pull the latest update!!!

To make the banner bar a link, you may need to add (in the CLI in the root of the project)

$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git

---------------------------------------------------------
To perform form validation effectively, a few (ha!) things needed to be changed around. From your perspective, you just need to make a few small changes in order to run the app locally.

$ npm install angular-messages

*NOTE* If you get an error message like "Error: EACCES", don't use sudo!!! Don't use sudo under any circumstances during this installation, if you do I will not help you sort things out. Instead, you need to do:

$ sudo chown -R [yourusername] [pathtothefolderyouneedpermissionsto]

Technically this is not correct either for a few reasons, but it's good enough for our purposes.

The other change is to inject this JS file into the app, but so long as you've pulled the most recent version, it will already be there.

