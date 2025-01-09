import java.util.List;
import java.util.Scanner;




public class InputUtils {

    public static <MyType extends Enum<MyType>> MyType selectOption(List<MyType> options, String promptMessage) {
        Scanner scanner = new Scanner(System.in);
        int choice = -1;

        while (choice < 1 || choice > options.size()) {
            System.out.println(promptMessage);

            for (int i = 0; i < options.size(); i++) {
                System.out.println((i + 1) + ". " + options.get(i).name());
            }
            System.out.print("Please enter your choice (1-" + options.size() + "): ");
            choice = scanner.nextInt();

            if (choice < 1 || choice > options.size()) {
                System.out.println("Invalid choice! Please try again.");
            }
        }

        return options.get(choice - 1);
    }
}
