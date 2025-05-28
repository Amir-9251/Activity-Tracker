import os
import sys
import json
from datetime import datetime
import subprocess
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def check_scrot_installed():
    try:
        subprocess.run(['which', 'scrot'], check=True, capture_output=True)
        return True
    except subprocess.CalledProcessError:
        return False

def take_screenshot(save_path):
    try:
        # Check if scrot is installed
        if not check_scrot_installed():
            raise Exception("scrot is not installed. Please install it using: sudo apt-get install scrot")

        # Ensure the directory exists
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
        # Log the absolute path
        abs_path = os.path.abspath(save_path)
        logging.info(f"Taking screenshot and saving to: {abs_path}")
        
        # Use scrot for taking screenshots
        result = subprocess.run(['scrot', save_path], check=True, capture_output=True, text=True)
        
        # Verify the file was created
        if not os.path.exists(save_path):
            raise Exception(f"Screenshot file was not created at {save_path}")
        
        # Verify file size
        file_size = os.path.getsize(save_path)
        if file_size == 0:
            raise Exception(f"Screenshot file is empty at {save_path}")
            
        logging.info(f"Screenshot taken successfully: {file_size} bytes")
            
        # Return success response
        response = {
            "success": True,
            "path": abs_path,
            "timestamp": datetime.now().isoformat()
        }
        logging.info(f"Screenshot taken successfully and saved to: {abs_path}")
        print(json.dumps(response))
        
    except subprocess.CalledProcessError as e:
        error_msg = f"Failed to take screenshot: {e.stderr}"
        logging.error(error_msg)
        print(json.dumps({
            "success": False,
            "error": error_msg
        }))
    except Exception as e:
        error_msg = f"Error taking screenshot: {str(e)}"
        logging.error(error_msg)
        print(json.dumps({
            "success": False,
            "error": error_msg
        }))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        take_screenshot(sys.argv[1])
    else:
        error_msg = "No save path provided"
        logging.error(error_msg)
        print(json.dumps({
            "success": False,
            "error": error_msg
        }))