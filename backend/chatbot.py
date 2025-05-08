def get_chatbot_response(message):
    """
    Generate a chatbot response based on the user's message.
    Args:
        message (str): The user's message.
    Returns:
        str: The chatbot's response.
    """
    message = message.lower().strip()
    
    if 'hello' in message or 'hi' in message:
        return "Hello! How can I assist you today?"
    elif 'fever' in message:
        return "It sounds like you might have a fever. Please take your temperature and consider taking acetaminophen if needed. Consult a doctor if it persists."
    elif 'headache' in message:
        return "For a headache, try resting in a quiet, dark room and staying hydrated. You can also take an over-the-counter pain reliever like ibuprofen."
    elif 'injury' in message:
        return "For an injury, please use the Injury Detection feature to analyze it, or describe your symptoms in more detail."
    elif 'appointment' in message:
        return "You can schedule a telemedicine appointment using the Telemedicine feature. Would you like to know more?"
    else:
        return "I'm not sure how to help with that. Could you provide more details or try the Symptom Analyzer feature?"