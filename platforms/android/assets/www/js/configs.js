function httpGet(url)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

var tConfigs = {};
var configServiceResponse = JSON.parse(httpGet('http://ec2-52-11-126-6.us-west-2.compute.amazonaws.com/HubServices/GetConfigurations.php'));

if (configServiceResponse.length > 0) {
    console.log("config success")
    tConfigs = {
        configLogo: configServiceResponse[0]['logo'],
        configBanner: configServiceResponse[0]['banner'],
        configBannerLink: configServiceResponse[0]['bannerLink'],
        configAbout: configServiceResponse[0]['about']
    };
}

