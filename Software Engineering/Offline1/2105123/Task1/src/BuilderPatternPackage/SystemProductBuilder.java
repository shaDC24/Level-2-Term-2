package BuilderPatternPackage;
import java.util.List;

import InternetConnectionPackage.InternetConnection;
import InternetConnectionPackage.InternetConnectionType;
import WebServerPackage.WebServer;
import companyPackages.TicketPackage;
import paymentpackage.OnspotPaymentTerminal;
import paymentpackage.PaymentTerminal;


public class SystemProductBuilder implements IBuilder{
    private InternetConnection internetConnection;
    private WebServer webServer;
    private TicketPackage Package;
    private PaymentTerminal paymentTerminal;
    private List<InternetConnectionType> availableInternetConnection;
    public IBuilder setPackage(TicketPackage Package) {
        this.Package = Package;
        this.Package.createMicrocontroller();
        this.Package.getMicrocontroller().hasAdded();
        this.availableInternetConnection=this.Package.getMicrocontroller().supportedInternetConnection();
        this.Package.createDisplay();
        this.Package.getDisplay().hasDisplayAdded();
        return this;
    }
    // public List<InternetConnectionType> getAvailableInternetConnection()
    // {
    //     return this.availableInternetConnection;
    // }
    public IBuilder setWebServer(WebServer webServer) {
        this.webServer = webServer;
        this.webServer.hasFrameworks();
        return this;
    }

    public IBuilder setInternetConnection(InternetConnection internetConnection) {
        //if(getAvailableInternetConnection().contains(internetConnection.getType())) {
        if(this.availableInternetConnection.contains(internetConnection.getType())) {
            this.internetConnection = internetConnection;
            this.internetConnection.hasInternetConnectionAdded();
        }
        else{
            this.internetConnection=null;
            System.out.println("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX "+internetConnection.getType().name() +" is not supported.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
        }
        return this;
    }
    public IBuilder setPayterminal()
    {
        this.paymentTerminal=new OnspotPaymentTerminal();
        return this;
    }

    public SystemProduct buildSystemProduct()
    {
        return  new SystemProduct(this.Package,this.internetConnection,this.webServer,this.paymentTerminal);
    }



}
