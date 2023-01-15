# NeuralFoundry ---- Neural Foundry Tech Test(Node js) 

## IMDB like Clone
*Total 12 APIs, 6 User API, 4 Review API, 1 Movie API & 1 Authentication API. This is a thorough backend handle of a movie mreview platform such as “IMDB”. So, the flow of Apis are like this >>>*

**Users register themselves, then they log in to their account. They can also update & delete their account.If they forgot password, then can reset password by sending otp to their registered Email**

**After login, user can give review & rate movies ,they can update review later. Users can also see what reviews they've given. They are also able to delete reviews.**

**If any user who do not want to login,they can only see what reviews given by others for a specific movie. The details of reviewer will not be shown there!**


 ## USER APIs
## 1) POST API - Creating a profile.                [Public_Route]
## 2) POST API – Logging in the User.               [Public_Route]
## 3) PUT API – Updating a profile.
## 4) DELETE API – Deleting a profile.
## 5) FORGOT PASSWORD API – Sending OTP to Email.   [Public_Route]
## 6) VERIFY OTP API – Verify OTP & Reset Password. [Public_Route]


 ## REVIEW APIs
## 1) POST API – Creating a Review.
## 2) GET API – Fetching Reviews by logged in User.
## 3) PUT API – Updating a Review.
## 4) DELETE API – Deleting a Review.


 ## MOVIE APIs
## 1) GET API - Fetching all Reviews for a movie . [Public_Route]
    This api take a movie name as a input through params & returns all the reviews for this movie.

 ## MIDDLEWARE API
## 1) Authentication

I have deployed the code on Railway app.You can only fetch movie reviews [Movie_API]
Please go to the link & search for movies
Available movies currently - Swades,Veer-Zaara,Sholay,3 Idiots
I will add more movie reviews soon...

Link>>>   https://neuralfoundry-production.up.railway.app/movie_name
Example - https://neuralfoundry-production.up.railway.app/swades

`     -------- Thanks for reading -----------     `
                **SOUMYA DUTTA**


