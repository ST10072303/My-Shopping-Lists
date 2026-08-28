# My Shopping Lists – Project Development Plan

## 1. Project Setup
- Create the React TypeScript project using Vite.
- Set up the project structure for pages, components, services, types, and Redux.
- Install the required dependencies.

## 2. Data Management
- Create `db.json` for storing users and shopping lists.
- Set up JSON Server for the REST API.
- Create TypeScript types for users, shopping lists, and shopping items.

## 3. User Authentication
- Create the Registration page.
- Add email, password, name, surname, and cell number fields.
- Use `bcryptjs` to hash passwords.
- Create the Login page.
- Validate user credentials against JSON Server.
- Use Redux to manage authentication state.
- Store the logged-in user in local storage.

## 4. Navigation and Authorisation
- Set up React Router.
- Create public and protected routes.
- Allow logged-in users to access the Home and Profile pages.
- Prevent logged-in users from accessing Login and Registration.

## 5. Profile Management
- Create the Profile page.
- Display the user's information.
- Allow users to update their name, surname, and cell number.
- Update the information in JSON Server and Redux.

## 6. Shopping List Management
- Create the Home page.
- Add the ability to create multiple shopping lists.
- Add shopping items with name, quantity, category, notes, and images.
- Display existing shopping lists.
- Allow users to edit shopping lists and items.
- Allow users to delete shopping lists and items.

## 7. Search and Sorting
- Add item search functionality.
- Display the search keyword in the URL.
- Add sorting by name and category.
- Store the selected sorting option in the URL.
- Update the page when URL parameters change.

## 8. Image Selection
- Integrate the Pixabay API.
- Allow users to search for and select images for shopping items.
- Store the selected image with the shopping item.

## 9. Sharing
- Add shopping list sharing using a unique list ID.
- Create a `/share/:id` route.
- Display the shared shopping list and its items.
- Configure Vercel routing so shared URLs work when opened directly.

## 10. Responsive Design
- Style the application using CSS Modules.
- Make the interface responsive for mobile, tablet, and desktop screens.
- Ensure forms, lists, buttons, and navigation remain easy to use on different screen sizes.

## 11. Testing
- Test each feature after implementation.
- Fix errors before moving to the next feature.
- Test authentication, CRUD operations, search, sorting, sharing, and images.
- Run `npm run build` to confirm the application builds successfully.

## 12. Deployment
- Deploy the React frontend to Vercel.
- Deploy JSON Server to Render.
- Use environment variables for API configuration.
- Connect the Vercel frontend to the Render backend.
- Test the complete application using the hosted frontend and database.

## 13. Final Result
The completed application provides users with a responsive shopping list system that supports authentication, profile management, shopping list CRUD operations, search, sorting, image selection, and sharing.
