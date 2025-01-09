package DisplayPackage;
public class touchScreen implements  Display{
    @Override
    public void hasDisplayAdded(){
        System.out.println("Touch Screen Display has added to System.");
    }
}
