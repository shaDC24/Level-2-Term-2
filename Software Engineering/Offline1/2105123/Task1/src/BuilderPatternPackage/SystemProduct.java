package BuilderPatternPackage;

import InternetConnectionPackage.InternetConnection;
import WebServerPackage.WebServer;
import companyPackages.*;
import paymentpackage.*;

public class SystemProduct {
    private InternetConnection internetConnection;
    private WebServer webServer;
    private TicketPackage aPackage;
    private PaymentTerminal PaymentTerminal;

    public SystemProduct(TicketPackage aPackage, InternetConnection internetConnection, WebServer webServer,
            PaymentTerminal paymentTerminal) {
        this.aPackage = aPackage;
        this.internetConnection = internetConnection;
        this.webServer = webServer;
        this.PaymentTerminal = paymentTerminal;
    }

    @Override
    public String toString()
    {
        String intcon=null;
        if(this.internetConnection!=null)
        {
            intcon=this.internetConnection.getClass().getSimpleName();
        }
        return "The Details Of the System: \n"+"Package: "+this.aPackage.getClass().getSimpleName()+"\n"
                +"Microcontroller : "+this.aPackage.getMicrocontroller().getClass().getSimpleName()+"\n"
                +"Display : "+this.aPackage.getDisplay().getClass().getSimpleName()+"\n"
                +"Identification : "+this.aPackage.getMicrocontroller().getTicketingOrIdentification().getClass().getSimpleName()+"\n"
                +"Payment Terminal : "+this.PaymentTerminal.getClass().getSimpleName()+"\n"
                +"Storage : "+this.aPackage.getMicrocontroller().getStorage().getClass().getSimpleName()+"\n"
                +"Controller : "+this.aPackage.getMicrocontroller().getController().getClass().getSimpleName()+"\n"
                +"Internet connection : "+intcon+"\n"
                +"Web Server : "+this.webServer.getClass().getSimpleName()+"\n";
    }
}
