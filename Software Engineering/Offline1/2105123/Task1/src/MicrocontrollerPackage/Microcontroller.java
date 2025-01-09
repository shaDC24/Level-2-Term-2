package MicrocontrollerPackage;

import TicketingOrIdentificationPackage.TicketingOrIdentification;
import ControllerPackage.*;
import InternetConnectionPackage.InternetConnectionType;
import StoragePackage.Storage;
import java.util.List;
public interface Microcontroller {
    void hasAdded();
    Storage getStorage();
    Controller getController();
    TicketingOrIdentification getTicketingOrIdentification();
    List<InternetConnectionType> supportedInternetConnection();
}
