package AccountPackage;

public abstract class Account {
    protected double interestRate;

    public abstract void getInterestRate();

    public void calculateAccountPayment(double principle) {
        getInterestRate();
        double EMI;
        int n;
        n = 1;
        System.out.println("Interest rate is : " + interestRate);
        interestRate = interestRate / 100.0;
        EMI = principle + principle * n * interestRate;
        System.out.println("Your yearly saving is " + EMI + " for interest rate " + interestRate + " for the amount "
                + principle + " you have given.");
    }

}
