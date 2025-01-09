package DisplayPackage;
public class OLED implements  Display{
    @Override
    public void hasDisplayAdded(){
        System.out.println("OLED Display has added to System.");
    }
}
