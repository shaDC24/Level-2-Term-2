
public class SingleFoodItem implements FoodItem {

    private String name;
    private double price;


    public SingleFoodItem(String name, double price) {
        this.name = name;
        this.price = price;
       
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public double getPrice() {
       return this.price;
    }
 
}
