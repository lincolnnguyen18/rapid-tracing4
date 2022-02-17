# export FLASK_APP=app && export FLASK_ENV=development && python3 -m flask run -h localhost -p 3001

from flask import Flask, request
from flask import jsonify
import cv2
import numpy as np

app = Flask(__name__)

# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'};

@app.route("/get-picture-preview", methods=["POST"])
def get_picture_preview():
  if 'picture' not in request.files:
    return jsonify({"error": "No picture file in request"})
  picture = request.files['picture']

def genGaussianKernel(width, sigma):
  coords = np.linspace(-width//2, width//2, width)
  x, y = np.meshgrid(coords, coords)
  kernel_2d = np.exp(-(x**2+y**2)/(2*sigma**2))
  kernel_2d /= kernel_2d.sum()
  return kernel_2d
