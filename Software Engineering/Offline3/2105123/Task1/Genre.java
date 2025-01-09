import java.util.ArrayList;
import java.util.List;


public class Genre implements Igenre {
    private List<Iobserver> observerList;
    private List<String> movielist;
    private String name;
    
    public Genre(String name) {
        this.name = name;
        observerList = new ArrayList<>();
        movielist = new ArrayList<>();
    }

    @Override
    public void addUser(Iobserver oIobserver) {
        observerList.add(oIobserver);
    }

    @Override
    public void removeUser(Iobserver oIobserver) {
        observerList.remove(oIobserver);
    }

    @Override
    public void notifyUser(String moviename) {
        for (Iobserver oIobserver : observerList) {
            new Thread(()->oIobserver.update(moviename, moviename)).start();

        }
    }
    public String getName(){
        return this.name;
    }

    public void uploadMovie(String movieName) {
        movielist.add(movieName);
        notifyUser(movieName);
    }


    public void exitGenre() {
        if (movielist.size() > 0) {
            System.out.println("The genre " + name + " has movies..");
            for (int i = 0; i < movielist.size(); i++) {
                System.out.println(i + 1 + "." + movielist.get(i));
            }
        }
        System.out.println("Genre for " + name + " has been shut down.");
    }

}
