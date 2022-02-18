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

def resize(image, max_dim):
  (h, w) = image.shape[:2]
  if h > w:
    new_h = max_dim
    new_w = (new_h * w) // h
  else:
    new_w = max_dim
    new_h = (new_w * h) // w
  new_dim = (new_w, new_h)
  if new_dim == image.shape[:2]:
    return image
  return cv2.resize(image, new_dim, interpolation = cv2.INTER_AREA)

@app.route("/get-picture-preview", methods=["POST"])
def get_picture_preview():
  body = request.get_json()
  filename = body["filename"]
  extension = body["extension"].lower()
  user_id = body['user_id']
  print(f"user_id: {user_id}")
  size = request.args.get('size', type=int)
  sigma = request.args.get('sigma', type=int)
  image = cv2.imread(f"../shared/{user_id}/temp/{filename}/original.{extension}")
  image = resize(image, 2000)
  thumbnail = resize(image, 400)
  cv2.imwrite(f"../shared/{user_id}/temp/{filename}/original.{extension}", image)
  kernel = genGaussianKernel(size, sigma)
  blurred_image = cv2.filter2D(image, -1, kernel)
  outline = cv2.subtract(blurred_image, image)
  details = cv2.subtract(image, blurred_image)
  cv2.imwrite(f"../shared/{user_id}/temp/{filename}/outline.{extension}", outline)
  cv2.imwrite(f"../shared/{user_id}/temp/{filename}/details.{extension}", details)
  cv2.imwrite(f"../shared/{user_id}/temp/{filename}/thumbnail.{extension}", thumbnail)
  return jsonify({"message": "success"})