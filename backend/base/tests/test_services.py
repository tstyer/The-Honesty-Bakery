import pytest
from base.services import validate_contact_form

# -- Learning note: assert just asks if something is true or false - if true = passes

# -- first test is to see if the error raises when no email is put in
def test_submission_no_email():
    # create fictional data to test
    data = {
        "name": "Travis",
        "email": "",
        "subject": "Cakes",
        "text": "Hello",
    }

    # now send the fictional data to the real function to test - must raise error
    with pytest.raises(ValueError):
        validate_contact_form(data)


# -- second test to see if an error raises when there is no subject

def test_submission_no_subject():
    data = {
        "name": "Travis",
        "email": "travisstyer.ts@gmail.com",
        "subject": "",
        "text": "test content",
    }

    with pytest.raises(ValueError):
        validate_contact_form(data)