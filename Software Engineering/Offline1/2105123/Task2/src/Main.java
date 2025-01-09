import AccountPackage.Account;
import LoanPackage.Loan;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {

        System.out.println("...Welcome To the Bank System...");

        factoryType choice = selectOption(factoryType.values(), "Enter any operation(1-3) :");

        switch (choice) {
            case REGULAR:
                BankAbstractFactory bankAbstractFactoryregular = CustomerFactory.getCuctomerFactory(choice);
                LoanOrSavings(bankAbstractFactoryregular);
                break;

            case VIP:
                BankAbstractFactory bankAbstractFactoryvip = CustomerFactory.getCuctomerFactory(choice);
                LoanOrSavings(bankAbstractFactoryvip);
                break;
            case PREMIUM:
                BankAbstractFactory bankAbstractFactorypremium = CustomerFactory.getCuctomerFactory(choice);
                LoanOrSavings(bankAbstractFactorypremium);
                break;
            default:
                System.out.println("Invalid operation yourChoice.Please try again:)");
        }

    }

    public static void LoanOrSavings(BankAbstractFactory bankAbstractFactory) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Select your operations:");
        LoanorsavingType loanorsavingType = selectOption(LoanorsavingType.values(), "Enter your operation : ");
        switch (loanorsavingType) {
            case ACCOUNTS:
                Account account = bankAbstractFactory.createAccount();
                System.out.print("Enter your principle: ");
                double principle = scanner.nextDouble();
                account.calculateAccountPayment(principle);
                break;
            case LOAN:
                Loan loan = bankAbstractFactory.createLoan();
                System.out.print("Enter your wanted loan amount: ");
                double loanAmount = scanner.nextDouble();
                System.out.print("Enter the number of years: ");
                int years = scanner.nextInt();
                loan.calculateLoanPayment(loanAmount, years);
                break;
            default:
                break;
        }
    }

    public static <MyType extends Enum<MyType>> MyType selectOption(MyType[] options, String promptMessage) {
        Scanner scanner = new Scanner(System.in);
        int yourChoice = -1;

        while (yourChoice < 1 || yourChoice > options.length) {
            System.out.println(promptMessage);
            for (int i = 0; i < options.length; i++) {
                System.out.println((i + 1) + ". " + options[i].name());
            }
            System.out.print("Please enter your yourChoice (1-" + options.length + "): ");
            yourChoice = scanner.nextInt();

            if (yourChoice < 1 || yourChoice > options.length) {
                System.out.println("Invalid operation yourChoice.Please try again:)");
            }
        }

        return options[yourChoice - 1];
    }
}
