import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Scanner;

class Menu {
    private Map<String, FoodItem> menuItems = new LinkedHashMap<>();

    public Menu() {
        menuItems.put("burger", new SingleFoodItem("Burger", 300));
        menuItems.put("fries", new SingleFoodItem("Fries", 100));
        menuItems.put("wedges", new SingleFoodItem("Wedges", 150));
        menuItems.put("shawarma", new SingleFoodItem("Shawarma", 200));
        menuItems.put("drink", new SingleFoodItem("Drink", 15));

        ComboFoodItem combo1 = new ComboFoodItem("Combo1");
        combo1.addFoodItem(menuItems.get("burger"));
        combo1.addFoodItem(menuItems.get("fries"));
        combo1.addFoodItem(menuItems.get("drink"));
        menuItems.put("combo1", combo1);

        ComboFoodItem combo2 = new ComboFoodItem("Combo2");
        combo2.addFoodItem(menuItems.get("shawarma"));
        combo2.addFoodItem(menuItems.get("drink"));
        menuItems.put("combo2", combo2);
    }

    public void displayMenu() {
        System.out.println("Menu:");
        for (Map.Entry<String, FoodItem> entry : menuItems.entrySet()) {
            System.out.println(entry.getValue().getMenuName() + " - " + entry.getValue().getPrice() + " tk");
        }
    }

    public void createCustomCombo() {
        Scanner scanner = new Scanner(System.in);
        String comboName;

        while (true) {
            System.out.print("Enter the name of the combo: ");
            comboName = scanner.nextLine().trim();

            if (menuItems.containsKey(comboName)) {
                System.out.println("A same named combo is here , Please choose a different name.");
            } else {
                break;
            }
        }

        ComboFoodItem originalCombo = new ComboFoodItem(comboName);

        System.out.println("Available commands:");
        System.out.println("Add [item]");
        System.out.println("Remove [item]");
        System.out.println("Free [item]");
        System.out.println("Discount [percentage]");
        System.out.println("Done - Save and exit.");

        while (true) {
            String input = scanner.nextLine().trim().toLowerCase();
            String[] commandParts = input.split(" ", 2);
            String command = commandParts[0];
            String itemName = commandParts.length > 1 ? commandParts[1].trim().toLowerCase() : "";

            switch (command) {
                case "add":
                    if (menuItems.containsKey(itemName)) {
                        originalCombo.addFoodItem(menuItems.get(itemName));
                    } else {
                        System.out.println("Item " + itemName.toUpperCase() + " not found in menu.");
                    }
                    break;

                case "remove":
                    if (menuItems.containsKey(itemName)) {
                        originalCombo.removeFoodItem(menuItems.get(itemName));

                    } else {
                        System.out.println("Item " + itemName.toUpperCase() + " not found in menu.");
                    }
                    break;

                case "free":
                    if (menuItems.containsKey(itemName)) {
                        originalCombo.makeFoodFree(menuItems.get(itemName));
                    
                    } else {
                        System.out.println("Item " + itemName.toUpperCase() + " not found in menu.");
                    }
                    break;

                case "discount":
                    try {
                        double discount = Double.parseDouble(itemName);
                        originalCombo.applyDiscount(discount);
                    } catch (NumberFormatException e) {
                        System.out.println("There is number exception : "+e);
                    }
                    break;

                case "done":
                    menuItems.put(comboName, originalCombo);
                    originalCombo.showDetails();
                    return;

                default:
                    System.out.println("Invalid command.Try again.");
            }
        }
    }
}

