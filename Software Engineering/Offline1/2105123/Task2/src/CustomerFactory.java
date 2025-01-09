
public class CustomerFactory {
    public static BankAbstractFactory getCuctomerFactory(factoryType fType) {
        switch (fType) {
            case REGULAR:
                return new RegularFactory();
            case VIP:
                return new VIPFactory();
            case PREMIUM:
                return new PremiumFactory();

            default:
                return null;
        }
    }

}
