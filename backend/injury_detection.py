from PIL import Image
import numpy as np

def analyze_injury(image):
    """
    Analyze the given image to identify the type of injury using basic color analysis.
    Args:
        image (PIL.Image): The image to analyze.
    Returns:
        dict: A dictionary with 'type' (type of injury) and 'medicine' fields.
    """
    try:
        # Convert image to RGB and then to numpy array
        image = image.convert('RGB')
        image_array = np.array(image)
        
        # Calculate average color in the image
        avg_color = np.mean(image_array, axis=(0, 1))
        avg_red, avg_green, avg_blue = avg_color
        
        # Simple color-based detection
        # High red might indicate blood (cut), purplish (bruise), etc.
        if avg_red > 150 and avg_red > avg_green + 20 and avg_red > avg_blue + 20:
            injury_type = "Cut"
            medicine = "Clean the wound with antiseptic and apply a bandage. Seek medical attention if deep."
        elif avg_blue > avg_red + 20 and avg_blue > avg_green + 20:
            injury_type = "Bruise"
            medicine = "Apply ice and rest for 24 hours. Use arnica cream if needed."
        else:
            injury_type = "No visible injury"
            medicine = "Monitor for symptoms. Consult a doctor if pain persists."
        
        return {
            'type': injury_type,
            'medicine': medicine
        }
    except Exception as e:
        raise Exception(f"Injury analysis failed: {str(e)}")