package companyPackages;
import DisplayPackage.Display;
import MicrocontrollerPackage.Microcontroller;

public interface TicketPackage {
    Microcontroller createMicrocontroller();
    Display createDisplay();
    Microcontroller getMicrocontroller();
    Display getDisplay();


}
