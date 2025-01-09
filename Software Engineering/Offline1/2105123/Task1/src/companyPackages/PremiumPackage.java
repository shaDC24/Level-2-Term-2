package companyPackages;

import DisplayPackage.Display;
import DisplayPackage.touchScreen;
import MicrocontrollerPackage.Microcontroller;
import MicrocontrollerPackage.RaspberryPi;

public class PremiumPackage implements TicketPackage {
    private Microcontroller microcontroller;
    private Display display;


    @Override
    public Microcontroller createMicrocontroller() {
        microcontroller = new RaspberryPi();
        return this.microcontroller;
    }

    @Override
    public Display createDisplay() {
        this.display=new touchScreen();
        return  this.display;
    }

    @Override
    public Microcontroller getMicrocontroller() {
        return this.microcontroller;
    }
    @Override
    public Display getDisplay() {
        return this.display;
    }
    PremiumPackage()
    {
        createMicrocontroller();
        createDisplay();
    }

}
