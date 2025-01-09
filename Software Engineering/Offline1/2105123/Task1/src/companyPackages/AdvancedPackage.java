package companyPackages;
import DisplayPackage.Display;
import DisplayPackage.OLED;
import MicrocontrollerPackage.Microcontroller;
import MicrocontrollerPackage.RaspberryPi;

public class AdvancedPackage  implements  TicketPackage{
    private Microcontroller microcontroller;
    private Display display;
    @Override
    public Microcontroller createMicrocontroller() {
        this.microcontroller=  new RaspberryPi();
        return this.microcontroller;
    }

    @Override
    public Display createDisplay() {
        this.display=new OLED();
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
    AdvancedPackage()
    {
        createMicrocontroller();
        createDisplay();
    }


}
