import java.util.ArrayList;
import java.util.List;

public class User implements Iobserver {

    private String nameOfobserver;
    private List<Igenre> favaoriteGenreList;

    public User(String name) {
        this.nameOfobserver = name;
        this.favaoriteGenreList = new ArrayList<>();
    }

    public void addFavouriteGenre(Igenre genreName) {
        System.out.println("Before adding your Favourite genres:");
        showFavGenre();
        if (!favaoriteGenreList.contains(genreName)) {
            favaoriteGenreList.add(genreName);
            genreName.addUser(this);
            System.out.println("Your current favourite genre list:");
            showFavGenre();
        } else {
            System.out.println("Already genre exists");
        }

    }

    public void removeFavouriteGenre(Igenre genreName) {
        System.out.println("Before removing your Favourite genres:");
        showFavGenre();
        if (favaoriteGenreList.contains(genreName)) {
            favaoriteGenreList.remove(genreName);
            genreName.removeUser(this);
            System.out.println("Your current favourite genre list:");
            showFavGenre();
        } else {
            System.out.println("Genre does not exists.");
        }

    }

    private void showFavGenre() {
        int i = 1;
        if (favaoriteGenreList.size() > 0) {
            for (Igenre genreName : favaoriteGenreList) {
                Genre grn = (Genre) genreName;
                System.out.println(i + ")" + grn.getName());
                i++;
            }
        } else {
            System.out.println("Favourite genre list is empty...");
        }
    }

    @Override
    public void update(String moviename, String genre) {
        System.out.println("Hello " + nameOfobserver + " !!!! The movie " + moviename + " in the genre " + genre
                + " has been updated.");
    }

}
