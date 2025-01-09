
public interface Igenre {
    void addUser(Iobserver oIobserver);
    void removeUser(Iobserver oIobserver);
    void notifyUser(String moviename);
}
