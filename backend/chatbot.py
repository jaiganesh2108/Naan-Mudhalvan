import google.generativeai as genai

# Configure the Gemini API with your API key
API_KEY = 'AIzaSyA3qErxrea3BhjA2RXRjBAhNqIWNShASIY'
genai.configure(api_key=API_KEY)

def get_chatbot_response(message):
    """
    Generate a chatbot response based on the user's message, using predefined rules or the Gemini API.
    Args:
        message (str): The user's message.
    Returns:
        str: The chatbot's response.
    """
    message = message.lower().strip()
    
    # Predefined responses
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
        # Use Gemini API for unhandled queries
        try:
            # Initialize the Gemini model (e.g., gemini-1.5-flash)
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            # Create a prompt to make the response health-related and concise
            prompt = f"You are a helpful medical chatbot. Provide a concise, accurate, and professional response to the following health-related query: {message}. If the query is not health-related, politely ask for clarification or suggest using a health-related feature."
            
            # Generate response from Gemini API
            response = model.generate_content(prompt)
            
            # Return the text from the response
            return response.text
        except Exception as e:
            # Handle potential errors (e.g., API rate limits, network issues)
            return f"Sorry, I encountered an issue: {str(e)}. Please provide more details or try the Symptom Analyzer feature."

# Example usage
if __name__ == "__main__":
    # Test cases
    test_messages = [
        "Hi there!",
        "I have a fever",
        "My head hurts",
        "I sprained my ankle",
        "Book an appointment",
        "What's the weather like?",
        "I feel dizzy and tired"
    ]
    
    for msg in test_messages:
        print(f"User: {msg}")
        print(f"Chatbot: {get_chatbot_response(msg)}\n")