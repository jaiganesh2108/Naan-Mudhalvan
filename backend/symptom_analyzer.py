def analyze_symptoms(symptoms):
    """
    Analyze the given symptoms and provide a diagnosis and recommendation.
    Args:
        symptoms (str): Comma-separated list of symptoms (e.g., "fever, headache").
    Returns:
        dict: A dictionary with 'diagnosis' and 'recommendation' fields.
    """
    symptoms = [s.strip().lower() for s in symptoms.split(',')]
    
    if 'fever' in symptoms and 'headache' in symptoms:
        diagnosis = "Possible Flu"
        recommendation = "Rest, stay hydrated, and take acetaminophen. Consult a doctor if symptoms worsen."
    elif 'fever' in symptoms:
        diagnosis = "Possible Infection"
        recommendation = "Monitor your temperature. Take acetaminophen and consult a doctor if fever exceeds 102°F."
    elif 'headache' in symptoms:
        diagnosis = "Tension Headache"
        recommendation = "Rest in a quiet, dark room. Take ibuprofen and stay hydrated."
    elif 'cough' in symptoms:
        diagnosis = "Possible Cold"
        recommendation = "Use a humidifier, drink warm fluids, and consider over-the-counter cough medicine."
    else:
        diagnosis = "Uncertain"
        recommendation = "Please provide more details or consult a doctor for a thorough examination."
    
    return {
        'diagnosis': diagnosis,
        'recommendation': recommendation
    }