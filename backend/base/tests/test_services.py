import pytest
from services import error_no_email, validate_contact_form

# -- Learning note: assert just asks if something is true or false - if true = passes

# -- first test is to see if the error raises when no email is put in
def test_submission_no_email():
    # create fictional data to test
    data = {
        "name": "Travis",
        "email": "",
        "subject": "Cakes",
        "text": "Hello"
    }

    # now send the fictional data to the real function to test - must raise error
    with pytest.raises(ValueError):
        validate_contact_form(data)
