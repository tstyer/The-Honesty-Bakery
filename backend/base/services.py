# --- Here, I will type new functions after writing their tests. This is to practice TDD. 

#Learning note: with python imports, you don't import file name, just module

# While setting this up, I learned not to try and inject the fictional data into the real contact form in django, 
# as that would be integration testing. 
# For TDD, I will just be testing the logic.

def validate_contact_form(data):
    email = data.get("email")

    return data




