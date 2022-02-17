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


@app.route("/get-picture-preview", methods=["POST"])
def get_picture_preview():
  body = request.get_json()
  filename = body["filename"]
  filename_only = filename.split(".")[0]
  extension = filename.split(".")[1]
  size = request.args.get('size', type=int)
  sigma = request.args.get('sigma', type=int)
  image = cv2.imread('../shared/' + filename)
  kernel = genGaussianKernel(size, sigma)
  blurred_image = cv2.filter2D(image, -1, kernel)
  outline = cv2.subtract(blurred_image, image)
  details = cv2.subtract(image, blurred_image)
  cv2.imwrite('../shared/' + filename_only + '_outline.' + extension, outline)
  cv2.imwrite('../shared/' + filename_only + '_details.' + extension, details)
  return jsonify({"message": "success"})