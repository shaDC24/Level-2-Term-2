package InternetConnectionPackage;

public class GsmModules implements InternetConnection {
    @Override
    public void hasInternetConnectionAdded() {
        System.out.println("GSM modules internet has been added to the system.");
    }

    @Override
    public InternetConnectionType getType() {
        return InternetConnectionType.GSM_MODULE;
    }
}