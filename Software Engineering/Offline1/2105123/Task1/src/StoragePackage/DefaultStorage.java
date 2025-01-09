package StoragePackage;

public class DefaultStorage implements Storage {
    @Override
    public void hasStorageAdded() {
        System.out.println("The system has the default storage from Default Storage class of Storage Interface.");
    }
}
