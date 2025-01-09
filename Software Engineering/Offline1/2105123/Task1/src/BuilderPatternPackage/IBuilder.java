package BuilderPatternPackage;

import InternetConnectionPackage.InternetConnection;
// import InternetConnectionPackage.InternetConnectionType;
import WebServerPackage.WebServer;
import companyPackages.TicketPackage;
//import java.util.List;

public interface IBuilder {
    IBuilder setPackage(TicketPackage Package);
    IBuilder setWebServer(WebServer webServer);
    IBuilder setInternetConnection(InternetConnection internetConnection);
    IBuilder setPayterminal();
    SystemProduct buildSystemProduct();
    // List<InternetConnectionType> getAvailableInternetConnection();
}
