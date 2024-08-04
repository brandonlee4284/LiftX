# LiftX Mobile App (IOS/Android)

## UI Designs

## Installation

### Option 1: Expo Go
To test this app to its fullest extent you will need to install the Expo Go App in App Store

Install all required npm packages:
```sh
npm i
```
Then run:
```sh
npm run start
```
Scan the QR code and open in the Expo Go app.

### Option 2: Mobile Simulator
Install all required npm packages:
```sh
npm i
```
To run on ios simulator (XCode required):
```sh
npm run ios
```
To run on android simulator:
```sh
npm run android
```

## Overview

In this project we created a cross platform mobile application for people who go to the gym where they can customize their own workout, track their workouts, and compete with friends through a real-time leaderboard. This app was created using React Native for the frontend as well as Firebase for the backend to deal with user authetication and cloud-based data storage. In addition we used Figma for complex UI/UX designs which provided an excellant guide for executing and accelerating the apps development with a well planned out timeline and product of design.

Our mission for building this app was to create a user-friendly platform for the average gym-goer, designed to be intuitive and free from the clutter that many other fitness apps tend to have. Moreover a major goal from this app was to build a sense of community by allowing users to connect and compete with friends who also go to the gym, providing the ability to view and share workout routines.

While we did not deploy this app, we conducted a beta test with a close group of about 20 friends to gather feedback. Nearly all testers reported a positive experience, and approximately 80% of them found the strength algorithm to be accurate, validating our approach and encouraging us to continue refining the app.

### User Authentication

Firebase has a built-in feature for user authentication that we implemented in this app. This provided useful and easy-to-use methods:
- **`createUserWithEmailAndPassword`**: This function from Firebase Authentication allows for the creation of new user accounts using email and password. When a user signs up, this method takes the user's email address and password, creates a new account, and stores the credentials securely in Firebase. It returns a promise that resolves with the user credentials, making it easy to integrate user sign-up functionality into the app.
- **`signInWithEmailAndPassword`**: This function is used to authenticate users who already have an account. By passing the user's email address and password, this method verifies the credentials and signs the user in if they are correct. It returns a promise that resolves with the user credentials upon successful authentication, facilitating seamless and secure user login.
- **`sendPasswordResetEmail`**: This function helps users who have forgotten their passwords. By providing their registered email address, this method sends a password reset email to the user. The email contains a link that allows the user to reset their password securely. This feature enhances user experience by enabling them to regain access to their accounts without manual intervention.
- **`sendEmailVerification`**: This function is used to send a verification email to users who have just created an account. The email contains a link that the user must click to verify their email address. This step ensures that the provided email is valid and belongs to the user, adding an extra layer of security and preventing the use of fake or mistyped email addresses.

By leveraging these methods, we were able to implement robust and user-friendly authentication features in our app, ensuring secure account creation, login, and recovery processes.

## Data Storage

In this app, we implemented both Async Storage and a cloud-based database to store user data, ensuring efficient and reliable data management.
- **Async Storage (local storage)**: We utilized React Native's Async Storage library for local storage. Upon opening the app, we first attempt to fetch user data from Async Storage. If the data is not available locally, we make a fetch request to the Firestore database. Once the data is retrieved from Firestore, it is stored in Async Storage for faster retrieval in future sessions. This approach minimizes the need for repeated network requests, enhancing the app's performance and providing a smoother user experience.
- **Firestore (cloud-based storage)**: A flexible and scalable database from Firebase, is used to store various types of user data such as usernames, saved workouts, friends, and strength scores. Firestore's real-time capabilities ensure that data is synchronized across all devices, maintaining consistency and accuracy.
  Some useful methods use from firebase:
  - **`getDoc`**: This function retrieves a single document from a specified Firestore collection. By providing a reference to the document, getDoc fetches the data and returns it, allowing the app to access and display the latest information stored in the cloud.
  - **`setDoc`**: This function creates or overwrites a document in a Firestore collection. By providing a reference to the document and the data to be stored, setDoc ensures that the user’s data is accurately saved in the database. This method is essential for initial data storage and when significant updates are made to a user's profile.
  - **`updateDoc`**: This function updates specific fields within a document in a Firestore collection without overwriting the entire document. By providing a reference to the document and the fields to be updated, updateDoc allows for partial updates, making it efficient for modifying specific pieces of user data, such as adding a new friend or updating a workout routine.

### Strength Calculation Algorithm
- 
### Friend System

Because of the read and write security rules that Firebase has in place, we encountered a challenge when trying to implement the friends system in a way that would only grant write access to authorized users. To address these issues, we designed the following solution:
- **`createPrivateFriends`**: To manage friends and friend requests, we created three different arrays: `fList` to store friends, `fReqReceived` to store received friend requests, and `fReqSent` to store sent friend requests. This structure ensures that friend data is organized and easily accessible while maintaining security and privacy.
- **`synchronizeFriends`**: This method is responsible for updating the `fList` and fetching any received friend requests. It also checks if a sent friend request matches any received friend request. If a match is found, it means both users have mutually accepted the friend request, and the friend is added to the user's `fList`. This ensures that the friends list is always up-to-date and reflects the current state of friend requests.
- **`sendFriendRequest`**: This function sends a friend request to another user by adding the request to the other user's `fReqReceived` array and also adds the request to the sender's `fReqSent` array. This allows the system to track friend requests from both the sender's and the recipient's perspectives, ensuring that friend request statuses are accurately maintained.
- **`acceptFriendRequest`**: When a user accepts a friend request, this function adds the friend to the user's `fList` and sends a friend request to the other friend. Since the other friend has already sent a friend request and it is stored in their `fReqSent` array, we call `synchronizeFriends` to ensure that when the other user launches their app, the friend will be automatically added back to their `fList`. This method ensures that the friend relationship is fully established and reflected on both sides.
  
## Further Improvements

To enhance the overall performance and user experience of our app, we have identified several areas for further improvements:
- **Speed Up Backend API Calls:** Optimizing the speed of backend API calls is crucial for improving the app’s responsiveness. This can be achieved through various methods:
  - **Caching:** Implementing caching strategies to store frequently accessed data locally can reduce the number of API calls, thus speeding up data retrieval.
  - **Batch Writing:** Grouping multiple write operations into a single batch can minimize the overhead associated with individual write operations, making the backend more efficient.
  - **Lazy Loading:** Loading data only when it is needed rather than all at once can reduce initial load times and improve perceived performance.
  - **Optimizing Database Queries:** Ensuring that database queries are efficient and indexed correctly can significantly reduce the time taken to fetch data from the backend.
  - Switch to a Different Database Service: While Firebase has been useful, switching to a more flexible database service could offer several advantages. A service like AWS DynamoDB, MongoDB, or PostgreSQL could provide greater flexibility and scalability:

- **Flexible Schema:** Unlike Firebase, which often requires more rigid structures, these databases support flexible schemas that can adapt to changing requirements without extensive rework.
Simpler Friend System Design: With a more flexible backend, we could simplify the friend system. For instance, using a relational database like PostgreSQL could allow for straightforward implementation of friend relationships using join tables, reducing the complexity of maintaining multiple arrays for friend requests and friends list.
Make UI More Intuitive: Enhancing the user interface to make it more intuitive can significantly improve user experience. This involves:

- **User Testing and Feedback:** Continuously gathering user feedback to identify pain points and areas of improvement in the UI.
Streamlined Navigation: Simplifying navigation flows to make it easier for users to access the features they need.
Visual Enhancements: Improving the visual design to be more appealing and easier to understand, ensuring that users can quickly grasp how to use the app.
Test More: Rigorous testing is essential to ensure the app's reliability and performance:

- **Deploy on TestFlight:** By deploying the app on TestFlight, we can gather more comprehensive feedback from a wider audience, identifying potential issues and areas for improvement.
App Store Deployment: After thorough testing and incorporating feedback, we can proceed with deploying the app on the App Store, making it available to a broader audience.
By implementing these improvements, we aim to enhance the performance, flexibility, and user experience of our app, ultimately delivering a more robust and enjoyable product to our users.







