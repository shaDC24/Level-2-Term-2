public interface IComboFoodItem extends FoodItem{

    public void addFoodItem(FoodItem foodItem);
    public void removeFoodItem(FoodItem foodItem);
    public double applyDiscount(double discount);
    public void makeFoodFree(FoodItem foodItem);
    public void showDetails();
}
