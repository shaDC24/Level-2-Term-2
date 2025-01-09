package companyPackages;
import DisplayPackage.Display;
import DisplayPackage.LED;
import MicrocontrollerPackage.ArduinoMega;
import MicrocontrollerPackage.Microcontroller;

public class StandardPackage  implements  TicketPackage{
    private Microcontroller microcontroller;
    private  Display display;
    @Override
    public Microcontroller createMicrocontroller() {
       this.microcontroller=  new ArduinoMega();
       return this.microcontroller;
    }

    @Override
    public Display createDisplay() {
        this.display=  new LED();
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

    StandardPackage()
    {
        createMicrocontroller();
        createDisplay();
    }

}
