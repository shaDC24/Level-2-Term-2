import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to Khaidai Bistro");

        Menu menu = new Menu();
        menu.displayMenu();
        Scanner scanner = new Scanner(System.in);
        
        while (true) {
            System.out.println();
            System.out.println("Press 1 to create a combo\n" + "2 to view menu \n" + "0 to exit\n");
            int choice = scanner.nextInt();
            scanner.nextLine();
            switch (choice) {
                case 1:
                    menu.createCustomCombo();
                    break;
                case 2:
                    menu.displayMenu();
                    break;
                case 0:
                    System.exit(0);
                    break;
                default:
                    System.out.println("Invalid option. Try again.");
            }
        }

    }
}
