# export FLASK_APP=app && export FLASK_ENV=development && python3 -m flask run -h localhost -p 3001

from flask import Flask, request
from flask import jsonify
import cv2
import numpy as np
import zipfile

app = Flask(__name__)

# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'};

def genGaussianKernel(width, sigma):
  coords = np.linspace(-width//2, width//2, width)
  x, y = np.meshgrid(coords, coords)
  kernel_2d = np.exp(-(x**2+y**2)/(2*sigma**2))
  kernel_2d /= kernel_2d.sum()
  return kernel_2d

def resize(image):
  max_dim = 1600
  (h, w) = image.shape[:2]
  if h > w:
    new_h = max_dim
    new_w = (new_h * w) // h
  else:
    new_w = max_dim
    new_h = (new_w * h) // w
  new_dim = (new_w, new_h)
  return cv2.resize(image, new_dim, interpolation = cv2.INTER_AREA)

@app.route("/get-picture-preview", methods=["POST"])
def get_picture_preview():
  body = request.get_json()
  original_filename = body["filename"]
  filename_only = original_filename.split(".")[0]
  extension = original_filename.split(".")[1]
  outline_filename = filename_only + '_outline.' + extension
  details_filename = filename_only + '_details.' + extension
  size = request.args.get('size', type=int)
  sigma = request.args.get('sigma', type=int)
  image = cv2.imread('../shared/' + original_filename)
  image = resize(image)
  cv2.imwrite('../shared/' + original_filename, image)
  kernel = genGaussianKernel(size, sigma)
  blurred_image = cv2.filter2D(image, -1, kernel)
  outline = cv2.subtract(blurred_image, image)
  details = cv2.subtract(image, blurred_image)
  cv2.imwrite('../shared/' + outline_filename, outline)
  cv2.imwrite('../shared/' + details_filename, details)
  return jsonify({"message": "success", "original": original_filename, "outline": outline_filename, "details": details_filename})