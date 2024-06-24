## Questions

### What issues, if any, did you find with the existing code?
 - not so much issues as maybe over-sights of an initial prototype app:
 - hardcoded URIs
 - obviously account security is just a prototype
 - page refreshes loose all state (ie: one has to login again)  

### What issues, if any, did you find with the request to add functionality?
 - the nodemon for the API did not pick-up the .env settings

### Would you modify the structure of this project if you were to start it over? If so, how?
 - i think this is an okay starting point, maybe eventually the structure would get less flat on the front and back-ends (UI: themes/layouts, pages, helpers/utils; API: ORM integration, error framework)
 - probably seperate the UI/API into different repos

### Were there any pieces of this project that you were not able to complete that you'd like to mention?
 - i would love to add unit tests for transaction and account handlers
 - for a bank system, I'm sure audit logs would be necessary
 - also a more robust logging framework 

### If you were to continue building this out, what would you like to add next?
- i think one thing I'd like to add is an ORM (maybe Prisma) on the backend. On the frontend, start building out a real login scheme

### If you have any other comments or info you'd like the reviewers to know, please add them below.