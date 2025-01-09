package DisplayPackage;
public class LED implements  Display{
    @Override
    public void hasDisplayAdded(){
        System.out.println("LED Display has added to System.");
    }
}