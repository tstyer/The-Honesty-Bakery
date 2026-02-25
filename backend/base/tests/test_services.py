from services import validate_contact_form

# -- Learning note: assert just asks if something is true or false - if true = passes
def test_submission_returns_success(data):
    assert validate_contact_form() == "Thank you for your message!"