package MicrocontrollerPackage;
import StoragePackage.Storage;
import TicketingOrIdentificationPackage.*;
import ControllerPackage.*;
abstract class AbstractMicrocontrollerClass implements Microcontroller{

    protected Storage storage;
    protected Controller controller;
    protected TicketingOrIdentification ticketingOrIdentification;

    public AbstractMicrocontrollerClass(Storage storage, Controller controller, TicketingOrIdentification ticketingOrIdentification) {
        this.storage = storage;
        this.controller = controller;
        this.ticketingOrIdentification = ticketingOrIdentification;
    }

    @Override
    public Storage getStorage() {
        return storage;
    }

    @Override
    public Controller getController() {
        return controller;
    }

    @Override
    public TicketingOrIdentification getTicketingOrIdentification() {
        return ticketingOrIdentification;
    }
//    @Override
//    public String toString()
//    {
//        return
//        getStorage().hasStorageAdded()+"\n"+
//        getController().hasControllerAdded()+"\n"+
//        getTicketingOrIdentification().hasIdentificationAdded();
//    }

}
