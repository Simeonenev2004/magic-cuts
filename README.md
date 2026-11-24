# Magic Cuts

A mobile app for booking appointments at the Magic Cuts barbershop. Built with React Native (Expo) and Firebase as my exam project for the React Native course.

The app interface is in Bulgarian, because it is made for a real local barbershop and its clients.

## Download APK

**Download the Android APK:** coming soon

## How to run the project

You need Node.js (LTS) and the Expo Go app on your phone.

1. Clone the repository:
   `git clone https://github.com/Simeonenev2004/magic-cuts.git`
2. Go into the folder:
   `cd magic-cuts`
3. Install the dependencies:
   `npm install`
4. Start the project:
   `npx expo start`
5. Scan the QR code with Expo Go (Android) or with the Camera app (iOS).

The Firebase configuration is already inside the project (`src/config/firebase.js`), so nothing else has to be set up. The services and barbers are already in the database.

You can register a new account from the app, or use this test account:

- Email: `test@magiccuts.com`
- Password: `test1234`

The `scripts/seed.js` file is what I used to fill the database with the services and barbers. It needs a private service account key and is not needed to run the app.

## Tech stack

- React Native with Expo
- React Navigation (native stack and bottom tabs)
- Firebase Authentication and Cloud Firestore
- AsyncStorage for the session
- expo-image-picker and expo-image-manipulator for the photos
- @react-native-community/datetimepicker and @react-native-picker/picker

---

# Functional Guide

## 1. Project Overview

**Application Name:** Magic Cuts

**Application Category / Topic:** Booking / Lifestyle (barbershop appointments)

**Main Purpose:**
Magic Cuts is a barbershop that takes appointments through Instagram messages. This app lets a client see the services, pick a barber, a day and a free hour, and book the appointment on their own. The client can attach a photo of the haircut they want, and later reschedule or cancel the appointment.

## 2. User Access & Permissions

### Guest (Not Authenticated)

- Available screens: Login and Register.
- A guest cannot see the services or any appointments.

### Authenticated User

- Main sections / tabs: Services (Услуги), My Appointments (Моите часове), Profile (Профил).
- Details screens: Service Details and Appointment Details.
- Create / Edit / Delete actions: the user can book an appointment, reschedule it (change barber, date, time, phone, note, photo) and cancel it. Every user sees only their own appointments.

## 3. Authentication & Session Handling

### Authentication Flow

1. When the app starts, it shows a loading indicator while Firebase checks if there is a saved session.
2. The status is checked with the `onAuthStateChanged` listener inside `AuthContext`. Until it answers for the first time, the `initializing` flag is true.
3. On successful login or registration the listener sets the user, the root navigator switches to the main tabs and the user profile (name, phone and email) is loaded from Firestore. On registration a document is also created in the `users` collection.
4. On logout the app asks for confirmation, calls `signOut`, the user becomes null and the root navigator shows the Login screen again.

### Session Persistence

- The session is stored by Firebase Auth in AsyncStorage (`initializeAuth` with `getReactNativePersistence`).
- After a restart Firebase restores the session by itself and `onAuthStateChanged` returns the user, so the app opens directly on the main tabs without asking for a password.

## 4. Navigation Structure

### Root Navigation Logic

`RootNavigator` renders only one of two navigators. If there is no user it renders `AuthStack`, and if there is a user it renders `MainTabs`. The inner screens do not exist in the navigation tree for a guest, so they cannot be reached without logging in.

### Main Navigation

A bottom tab navigator with 3 tabs: Services, My Appointments and Profile.

### Nested Navigation

Yes, there are stack navigators inside the tabs:

- `ServicesStack` (inside the Services tab): Services List → Service Details → Book Appointment
- `BookingsStack` (inside the My Appointments tab): My Appointments → Appointment Details → Edit Appointment
- `AuthStack`: Login → Register

There are 9 screens in total.

## 5. List → Details Flow

### List / Overview Screen

- The Services List shows all services from Firestore with an icon, name, duration and price. The My Appointments list shows the appointments of the logged-in user, upcoming first.
- The user scrolls the list, pulls down to refresh it and taps a card to open it.

### Details Screen

- Navigation is triggered by tapping a card in the list.
- Service Details receives `serviceId` and `name` through the route parameters. The id is used to load the service from Firestore and the name is used for the header title. Appointment Details receives `bookingId` and loads the appointment by it.

## 6. Data Source & Backend

### Backend Type

Real backend: Firebase (Authentication and Cloud Firestore). The collections are `users`, `services`, `barbers`, `bookings` and `slots`. Access is limited with Firestore security rules.

## 7. Data Operations (CRUD)

### Read (GET)

- Services List and Service Details read from `services` and `barbers`.
- My Appointments and Appointment Details read from `bookings`. The Profile screen also reads them to show how many upcoming and past appointments the user has.
- The booking form reads the taken hours from `slots` for the chosen barber and date.
- Both lists have pull-to-refresh.

### Create (POST)

The user opens a service, taps "Запази час", fills in the form and saves. A new document is created in `bookings`, together with documents in `slots` for the taken half-hour slots. This is done in a transaction, so two people cannot book the same hour.

### Update / Delete (Mutation)

- **Update:** from Appointment Details the user taps "Пренасрочи" and changes the appointment. The old slots are released and the new ones are taken in one transaction.
- **Delete:** the user taps "Откажи часа" and confirms. The appointment and its slots are deleted.
- After booking the app opens My Appointments, after rescheduling it goes back to the details and after cancelling it goes back to the list. The list and the details reload their data when the screen gets focus.

## 8. Forms & Validation

### Forms Used

- Login form
- Register form
- Book Appointment form
- Edit Appointment form (the same form component with the current values filled in)

Besides text fields, the booking form uses a Picker (barber), a DateTimePicker (date) and a Switch (first visit).

### Validation Rules

The validation is written with custom functions in `src/utils/validation.js`.

- **Email:** required; must be a valid email format.
- **Phone:** required; must be a valid Bulgarian mobile number (`08XXXXXXXX` or `+3598XXXXXXXX`).
- **Password (multiple rules):** required; at least 6 characters. On registration the repeated password must also match.
- **Date (multiple rules):** required; cannot be in the past; cannot be a day off for the barber (Sunday).
- **Name:** required; at least 2 characters.
- **Barber and hour:** both are required in the booking form.
- **Note:** optional; maximum 200 characters.

## 9. Native Device Features

### Used Native Feature(s)

Camera / Image Picker (`expo-image-picker`).

### Usage Description

- It is used in the booking form, in the section for a photo of the wanted haircut.
- The user can take a new photo with the camera or pick one from the gallery. The app asks for permission first. The photo is resized and compressed, saved together with the appointment in Firestore and shown in Appointment Details. This way the barber can see what the client wants before the visit.

## 10. Typical User Flow

1. The user registers with name, phone, email and password.
2. On the Services tab they pick a service, for example "Фейд", and read the details.
3. They tap "Запази час", choose a barber, a date and one of the free hours, and take a photo of the haircut they want.
4. They save and the app opens My Appointments, where the new appointment is shown.
5. Later they open the appointment and reschedule it for another hour, or cancel it.

## 11. Error & Edge Case Handling

- **Authentication errors:** Firebase error codes are translated to messages in Bulgarian (wrong email or password, email already in use, too many attempts, no internet) and shown above the button. Field errors are shown under each field.
- **Network or data errors:** the lists, the details screens and the booking screens have a loading state and an error state with an "Опитай отново" button. If the free hours cannot be loaded, the form shows a message that can be tapped to try again. If the numbers in the Profile cannot be loaded, they are shown as "–". If the chosen hour gets taken by someone else in the meantime, the user sees a message and the free hours are reloaded.
- **Empty or missing data states:** an empty services list and an empty appointments list show a message, and the appointments one has a button to the services. If there are no free hours for a day, the form says so. If the camera or gallery permission is denied, the app shows an alert.
