const validator = require("validator")


const validateSignup = (req) => {
    const {firstName,lastName,email,password} = req.body;

   if(firstName && lastName)
   {
        if(!(firstName.length >= 2 && firstName.length <= 20))
        {
            throw new Error("First Name is too short or too Long");
        } 
        if(!(lastName.length >= 2 && lastName.length <= 20))
        {
            throw new Error("Last name is too short or too Long ");
        }
   }

   if(email && !validator.isEmail(email))
   {
    throw new Error("Enter valid the email");
   }

   if(!password)
   {
    throw new Error("Password is required.");
   }
   else if(!validator.isStrongPassword(password))
   {
    throw new Error("Please enter Strong password");
   }

   
}

module.exports = {
    validateSignup
}