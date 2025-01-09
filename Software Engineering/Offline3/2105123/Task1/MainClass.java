import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class MainClass {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Map<String, Genre> genres = new HashMap<>();
        genres.put("thriller", new Genre("Thriller"));
        genres.put("horror", new Genre("Horror"));
        genres.put("comedy", new Genre("Comedy"));
        Map<String, User> users = new HashMap<>();

        System.out.println("Welcome to DesiFlix!");
        System.out.println("********************************************************************************************************************************");

        while (true) {
            System.out.println("\nAre you a user or movie uploader:");
            System.out.println("1. User");
            System.out.println("2. Movie Uploader");
            System.out.println("3. Exit");
            System.out.print("Enter your choice: ");
            int roleChoice = scanner.nextInt();
            scanner.nextLine();

            switch (roleChoice) {
                case 1:
                    handleUserActions(scanner, users, genres);
                    break;

                case 2:
                    handleMovieUploaderActions(scanner, genres);
                    break;

                case 3:
                    System.out.println("Exiting DesiFlix...");
                    exitingGenres(genres);
                    scanner.close();
                    return;

                default:
                    System.out.println("Invalid choice! Please try again.");
            }
        }
    }

    private static void handleUserActions(Scanner scanner, Map<String, User> users, Map<String, Genre> genres) {
        while (true) {
            System.out.println("\nUser Menu:");
            System.out.println("1. Create a new user account");
            System.out.println("2. Update user preferences (subscribe to genres)");
            System.out.println("3. Update user preferences (Unsubscribe to genres)");
            System.out.println("4. Back to main menu");
            System.out.print("Enter your choice: ");
            int userChoice = scanner.nextInt();
            scanner.nextLine();

            switch (userChoice) {
                case 1:
                    System.out.print("Enter the user's name: ");
                    String userName = scanner.nextLine();
                    if (users.containsKey(userName)) {
                        System.out.println("User already exists. Please choose another name.");
                    } else {
                        User newUser = new User(userName);
                        users.put(userName, newUser);
                        System.out.print(
                                "Enter genres for your favaourite list  (comma-separated: thriller, horror, comedy): ");
                        String[] favGenre = scanner.nextLine().split(",");
                        for (String genreName : favGenre) {
                            Genre genre = genres.get(genreName.trim().toLowerCase());
                            if (genre != null) {
                                newUser.addFavouriteGenre(genre);
                            } else {
                                System.out.println("Genre " + genreName + " not found.");
                            }
                        }
                        System.out.println("User " + userName + " created successfully!");
                    }
                    break;

                case 2:
                    System.out.print("Enter the user's name: ");
                    String existingUserName = scanner.nextLine();
                    User user = users.get(existingUserName);
                    if (user == null) {
                        System.out.println("User not found. Please create an account first.");
                    } else {
                        System.out.print("Enter genres to subscribe (comma-separated: thriller, horror, comedy): ");
                        String[] genresToSubscribe = scanner.nextLine().split(",");
                        for (String genreName : genresToSubscribe) {
                            Genre genre = genres.get(genreName.trim().toLowerCase());
                            if (genre != null) {
                                user.addFavouriteGenre(genre);
                            } else {
                                System.out.println("Genre " + genreName + " not found.");
                            }
                        }
                        System.out.println("User " + existingUserName + " preferences updated!");
                    }
                    break;
                case 3:
                    System.out.print("Enter the user's name: ");
                    String curUserName = scanner.nextLine();
                    User curuser = users.get(curUserName);
                    if (curuser == null) {
                        System.out.println("User not found. Please create an account first.");
                    } else {
                        System.out.print("Enter genres to unsubscribe (comma-separated: thriller, horror, comedy): ");
                        String[] genresToSubscribe = scanner.nextLine().split(",");
                        for (String genreName : genresToSubscribe) {
                            Genre genre = genres.get(genreName.trim().toLowerCase());
                            if (genre != null) {
                                curuser.removeFavouriteGenre(genre);
                            } else {
                                System.out.println("Genre " + genreName + " not found.");
                            }
                        }
                        System.out.println("User " + curUserName + " preferences updated!");
                    }
                    break;

                case 4:
                    return;

                default:
                    System.out.println("Invalid choice! Please try again.");
            }
            System.out.println("********************************************************************************************************************************");
        }
    }

    private static void handleMovieUploaderActions(Scanner scanner, Map<String, Genre> genres) {
        System.out.print("Enter the movie name: ");
        String movieName = scanner.nextLine();
        System.out.print("Enter the genre of the movie (thriller, horror, comedy): ");
        String genreName = scanner.nextLine().toLowerCase();

        Genre genre = genres.get(genreName);
        if (genre != null) {
            genre.uploadMovie(movieName);
        } else {
            System.out.println("Genre '" + genreName + "' not found.");
        }
        System.out.println("********************************************************************************************************************************");
    }

    private static void exitingGenres(Map<String, Genre> genres) {
        for (Genre genre : genres.values()) {
            genre.exitGenre();
        }
    }
}
