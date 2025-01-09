package ControllerPackage;
public class touchScreenController implements  Controller{
    @Override
    public void hasControllerAdded() {
        System.out.println("The Touch Screen works as a controller.");
    }

}
