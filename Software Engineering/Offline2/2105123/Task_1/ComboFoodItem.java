
import java.util.ArrayList;
import java.util.List;

public class ComboFoodItem implements IComboFoodItem {
    private String name;
    private double price;
    private List<FoodItem> foodItems;
    private List<FoodItem> freeFoodItems;
    private double discount;

    public ComboFoodItem(String name) {
        this.name = name;
        this.price = 0.0;
        this.discount = 0.0;
        this.foodItems = new ArrayList<>();
        this.freeFoodItems = new ArrayList<>();
    }

    @Override
    public String getName() {
        return this.name;
    }

    @Override
    public String getMenuName() {

        String comboname = name;

        if (!foodItems.isEmpty()) {
            comboname += " (";
            for (int i = 0; i < foodItems.size(); i++) {
                comboname += foodItems.get(i).getName();
                if (i < foodItems.size() - 1) {
                    comboname += "+";
                }
            }
            comboname += ")";
        }
        if (!freeFoodItems.isEmpty()) {
            comboname += " (";
            for (int i = 0; i < freeFoodItems.size(); i++) {
                comboname += freeFoodItems.get(i).getName() + " (Free!!!)";
                if (i < freeFoodItems.size() - 1) {
                    comboname += "+";
                }
            }
            comboname += ")";
        }
        if (this.discount > 0.0)
            comboname += " with discount " + this.discount + "%";
        return comboname;
    }

    @Override
    public double getPrice() {
        double total=0.0;
        if (!foodItems.isEmpty()) {
            for (FoodItem foodItem : foodItems) {
                total += foodItem.getPrice();
            }
        }
        this.price=total;
        if (this.discount > 0.0)
            return applyDiscount(this.discount);

        return this.price;
    }

    @Override
    public void addFoodItem(FoodItem foodItem) {
        foodItems.add(foodItem);
    }

    @Override
    public void removeFoodItem(FoodItem foodItem) {
        if (foodItems.contains(foodItem))
            foodItems.remove(foodItem);
        else
            System.out.println("Item not found in this combo.");
    }

    @Override
    public double applyDiscount(double discount) {
        this.discount = discount;
        return this.price * (1 - (discount / 100));
    }

    @Override
    public void makeFoodFree(FoodItem foodItem) {
        freeFoodItems.add(foodItem);
    }

    @Override
    public void showDetails() {
        double priceee=getPrice();
        System.out.println("Your combo :");
        System.out.println(name);
        if (!foodItems.isEmpty())
            for (FoodItem foodItem : foodItems) {
                System.out.println("  -  " + foodItem.getMenuName());
            }
        if (!freeFoodItems.isEmpty())
            for (FoodItem foodItem : freeFoodItems) {
                System.out.println("  -  " + foodItem.getMenuName() + " (Free!!!)");
            }

        System.out.println("Total - " + this.price + " tk");
        if (this.discount <= 0.0) {
            ;
        } else {
            System.out.println("Discunt - " + this.discount + "%");
            System.out.println("Discounted Total - " + priceee + "tk");
        }
    }

}