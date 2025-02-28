# Frontend setup

### API
Makes it so every request sent to the backend has the JWT.
import this API module and make axio calls through it

Example of axios post call: `let response = await api.post("/users/login", "dataToBeSent in post request")`

### Protected Route
Wrap any route you want to protect inside this in the router part of your application like this

`<ProtectedRoute>
    <RouteToBeProtected/>
</ProtectedRoute>`

### Important
In your login component make sure to set the tokens in the local storage like this

`LocalStorage.setItem(ACCESS_TOKEN, response.data.token)`

`localStorage.setItem(REFRESH_TOKEN, response.data.refreshToken);`





