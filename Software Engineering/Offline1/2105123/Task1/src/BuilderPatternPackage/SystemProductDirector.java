package BuilderPatternPackage;

import InternetConnectionPackage.InternetConnection;
import InternetConnectionPackage.InternetConnectionFactory;
import InternetConnectionPackage.InternetConnectionType;
import WebServerPackage.WebFrameworkType;
import WebServerPackage.WebServer;
import WebServerPackage.WebServerFactory;
import companyPackages.PackageFactory;
import companyPackages.PackageType;
import companyPackages.TicketPackage;


public class SystemProductDirector {
    IBuilder systemProductBuilder;


    public void constructSystem(IBuilder builder, PackageType selectedPackage, InternetConnectionType selectedInternet,
            WebFrameworkType selectedwebframe) {
        TicketPackage packages =  PackageFactory.getPackage(selectedPackage);

        InternetConnection internetConnection = InternetConnectionFactory.getInternetConnection(selectedInternet);

        WebServer webServer = WebServerFactory.getWebServer(selectedwebframe);

        systemProductBuilder = builder;
        systemProductBuilder.setPackage(packages).setInternetConnection(internetConnection).setWebServer(webServer).setPayterminal();

    }
}
