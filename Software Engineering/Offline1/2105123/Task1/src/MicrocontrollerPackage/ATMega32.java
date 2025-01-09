package MicrocontrollerPackage;

import ControllerPackage.SeparateControllerUnit;
import InternetConnectionPackage.InternetConnectionType;
import StoragePackage.SDcard;
import TicketingOrIdentificationPackage.RFIDcards;
import java.util.List;
import java.util.Arrays;

public class ATMega32 extends AbstractMicrocontrollerClass {

    public ATMega32() {
        super(new SDcard(), new SeparateControllerUnit(), new RFIDcards());
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
        return Arrays.asList(InternetConnectionType.WIFI, InternetConnectionType.GSM_MODULE);
    }
}
