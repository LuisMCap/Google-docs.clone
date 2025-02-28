# Backend

The backend was built on express and the authentication is done with passport and JWT tokens. Every route that needs to be verified checks if the JWT token is valid, and if that's the access, grants appropiate access.

Passwords are hashed and are never stored as literal values.

Users can be created, and you can invite users to participate with you and work on the same document at the same time.

It checks if a valid user exists prior to sending an invite and responds accordingly if the user you are trying to invite does not exist or already has an invitation.



