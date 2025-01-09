package paymentpackage;

public abstract class PaymentTerminal {
    private boolean hasChange = false;

    public abstract void PaymentType();

    public void collectAndStoreCash() {
        System.out.println("The payment is collected and stored.");
    }

    public void ProvideChange() {
        System.out.println("Thae change will be given if needed.");
        if (hasChange) {
            System.out.println("The passenger is provided with change.");
        } else {
            System.out.println("No change needed.");
        }
    }

}
