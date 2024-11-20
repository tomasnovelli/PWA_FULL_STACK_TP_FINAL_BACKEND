
Password Validation

- at least 8 characters
- must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
- Can contain special characters

/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm

////

username Validation

Minimum length (3).
Maximum length(24).
Can only contain alphanumeric characters and the following special characters: dot (.), underscore(_) and dash (-). The special characters cannot appear more than once consecutively or combined.

/(?!.*[\.\-\_]{2,})^[a-zA-Z0-9\.\-\_]{3,24}$/gm

///

email validation

/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)