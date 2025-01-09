package InternetConnectionPackage;

public class Wifi implements InternetConnection {
    @Override
    public void hasInternetConnectionAdded() {
        System.out.println("Wifi internet has been added to the system.");
    }

    @Override
    public InternetConnectionType getType() {
        return InternetConnectionType.WIFI;
    }
}
