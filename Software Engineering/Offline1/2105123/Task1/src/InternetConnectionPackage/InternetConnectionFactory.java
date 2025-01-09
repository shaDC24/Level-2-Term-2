package InternetConnectionPackage;

public class InternetConnectionFactory {
    public static InternetConnection getInternetConnection(InternetConnectionType internetConnectiontype) {
        if (internetConnectiontype == null) {
            return null;
        }
        switch (internetConnectiontype) {
            case WIFI:
                return new Wifi();
            case ETHERNET:
                return new EtherNet();
            case GSM_MODULE:
                return new GsmModules();
            default:
                return null;
        }
    }
}
