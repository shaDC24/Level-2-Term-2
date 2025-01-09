package companyPackages;

import DisplayPackage.Display;
import DisplayPackage.LCD;
import MicrocontrollerPackage.ATMega32;
import MicrocontrollerPackage.Microcontroller;

public class BasicPackage implements TicketPackage {
    private Microcontroller microcontroller;
    private Display display;

    @Override
    public Microcontroller createMicrocontroller() {
        this.microcontroller = new ATMega32();
        return this.microcontroller;
    }

    @Override
    public Display createDisplay() {
        this.display=new LCD();
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
    BasicPackage()
    {
        createMicrocontroller();
        createDisplay();
    }

}
