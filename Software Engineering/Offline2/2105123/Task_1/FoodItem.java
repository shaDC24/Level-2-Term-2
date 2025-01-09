public interface FoodItem {
    public String getName();
    public double getPrice();  
    public  default String getMenuName(){
        return getName();
    }
}
