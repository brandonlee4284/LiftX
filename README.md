# LiftX Mobile App (IOS/Android)

![LiftX_UI](https://github.com/user-attachments/assets/7853722e-fc37-4dd3-893c-3b5df34b2093)

## Overview

In this project, we developed a cross-platform mobile application for gym-goers to customize workouts, track progress, and compete with friends via a real-time leaderboard. The app was built using React Native for the frontend and Firebase for the backend, handling user authentication and cloud-based data storage. Moreoever, we used Figma for complex UI/UX design which helped guide and accelerate development with a well-planned timeline and detailed design. For data storage, we used both Async Storage and a cloud-based database. React Native's Async Storage library was utilized for local data caching and Firestore was used for retrieving user data when not available locally. Implementing the friend system was challenging due to Firebase's read and write security rules however we addressed this by developing our own custom methods for updating friend lists as well as for sending, accepting, and deleting friend requests.

Our mission for building this app was to create a user-friendly platform for the average gym-goer, designed to be intuitive and free from the clutter that many other fitness apps tend to have. Moreover a major goal from this app was to build a sense of community by allowing users to connect and compete with friends who also go to the gym, providing the ability to view and share workout routines.

While we did not deploy this app, we conducted a beta test with a close group of about 20 friends to gather feedback. Nearly all testers reported a positive experience, and approximately 80% of them found the strength algorithm to be accurate, validating our approach and encouraging us to continue refining the app.

## Strength Algorithm
To calculate a user's strength score we considered their one-rep max percentile, determmined using [Bryzcki Formula](https://www.vcalc.com/wiki/brzycki), along with their body weight. This data was then inputed into a polynomial regression model to calculate the user's respective strength score. The score was subsequently normalized to fall within a range of 0 to 1000.

![strengthGraph](https://github.com/user-attachments/assets/5e3ab2cd-6ba4-4dfb-95b2-93aaa54754fe)

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

## Further Improvements

To improve the performance and user experience of our app, we've pinpointed several key areas for adjustments:

- Speed Up Backend API Calls:
  - Caching: Store frequently accessed user data locally to reduce API calls and speed up data retrieval.
  - Batch Writing: Combine multiple write operations into a single batch to minimize overhead and increase efficiency.
  - Lazy Loading: Load data only when needed to reduce initial load times and improve perceived performance.
  - Optimizing Database Queries: Ensure database queries are efficient and well-indexed to reduce data fetching time.
 
- Transition to a More Flexible Database Service:
  - Flexible Schema: Moving away from Firebase to a service like AWS DynamoDB, MongoDB, or PostgreSQL could offer greater flexibility and scalability.
  - Simplified Friend System: A more flexible backend would allow for a simpler design of the friend system, reducing the complexity of maintaining multiple arrays for friend requests and friends lists.
  
- Improve UI:
  - User Testing and Feedback: Continuously gather user feedback to identify and address pain points.
  - Visual Enhancements: Improve the visual design to make the app more appealing and easier to use.

- Deployment:
  - Deploy on TestFlight: Gather comprehensive feedback from a wider audience to identify potential issues.
  - App Store Deployment: After incorporating feedback, deploy the app on the App Store to reach a broader audience.
 
    
