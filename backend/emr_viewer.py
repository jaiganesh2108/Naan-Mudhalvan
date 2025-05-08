def get_emr(user_id):
    """
    Retrieve EMR data for the given user.
    Args:
        user_id (str): The user's ID.
    Returns:
        dict: EMR data.
    """
    # Mock EMR data
    return {
        'userId': user_id,
        'name': 'John Doe',
        'age': 30,
        'medicalHistory': [
            {'date': '2024-01-15', 'diagnosis': 'Flu', 'treatment': 'Antiviral medication'},
            {'date': '2024-06-20', 'diagnosis': 'Sprained ankle', 'treatment': 'Rest and ice'}
        ],
        'allergies': ['Penicillin'],
        'lastVisit': '2024-06-20'
    }