package MicrocontrollerPackage;

import StoragePackage.*;
import ControllerPackage.touchScreenController;
import InternetConnectionPackage.InternetConnectionType;
import TicketingOrIdentificationPackage.NFCcards;
import java.util.List;
import java.util.Arrays;

public class RaspberryPi extends AbstractMicrocontrollerClass {
    public RaspberryPi() {
        super(new DefaultStorage(), new touchScreenController(), new NFCcards());
    }

    @Override
    public void hasAdded() {
        System.out.println(getClass().getSimpleName() + " has added to the system.");
        storage.hasStorageAdded();
        controller.hasControllerAdded();
        ticketingOrIdentification.hasIdentificationAdded();

    }

    @Override
    public List<InternetConnectionType> supportedInternetConnection() {
        return Arrays.asList(InternetConnectionType.WIFI, InternetConnectionType.GSM_MODULE,
                InternetConnectionType.ETHERNET);
    }
}