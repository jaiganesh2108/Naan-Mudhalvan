def initiate_session(user_id, preferred_time):
    """
    Initiate a telemedicine session for the given user.
    Args:
        user_id (str): The user's ID.
        preferred_time (str): Preferred time for the session.
    Returns:
        dict: Session details.
    """
    # Mock session creation
    session_id = f"session_{user_id}_{preferred_time.replace(' ', '_')}"
    meeting_link = f"https://meet.example.com/{session_id}"
    
    return {
        'sessionId': session_id,
        'meetingLink': meeting_link,
        'scheduledTime': preferred_time,
        'doctor': 'Dr. John Smith'
    }