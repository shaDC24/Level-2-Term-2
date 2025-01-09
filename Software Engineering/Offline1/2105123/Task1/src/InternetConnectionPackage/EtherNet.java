package InternetConnectionPackage;
public class EtherNet implements InternetConnection{
    @Override
    public void hasInternetConnectionAdded() {
        System.out.println("Ethernet internet has been added to the system.");
    }

    @Override
    public InternetConnectionType getType() {
        return InternetConnectionType.ETHERNET;
    }
}

