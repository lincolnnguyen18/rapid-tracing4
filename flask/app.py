# export FLASK_APP=app && export FLASK_ENV=development && python3 -m flask run -h localhost -p 3001

from flask import Flask, request
from flask import jsonify
from flask_mysqldb import MySQL
import cv2
import numpy as np
import zipfile
import mysql.connector
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import matplotlib.ticker as ticker
import datetime as dt
import random
import string
import os
import time

# mydb = mysql.connector.connect(
#   host="localhost",
#   user="admin",
#   password="pass123",
#   database="rapid_tracing"
# )

app = Flask(__name__)
app.config["MYSQL_USER"] = "admin"
app.config["MYSQL_PASSWORD"] = "pass123"
app.config["MYSQL_DB"] = "rapid_tracing"
mysql = MySQL(app)

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

def get_temp_name(user_id):
  # get list of files in ../shared/{user_id}/temp
  temp_dir = f"../shared/{user_id}/temp"
  temp_files = os.listdir(temp_dir)
  temp_name = ''.join(random.choice(string.digits + string.ascii_letters) for _ in range(10))
  while temp_name in temp_files:
    temp_name = ''.join(random.choice(string.digits + string.ascii_letters) for _ in range(10))
  return temp_name

@app.route("/get-picture-preview", methods=["POST"])
def get_picture_preview():
  body = request.get_json()
  filename = body["filename"]
  extension = body["extension"].lower()
  user_id = body['user_id']
  print(f"user_id: {user_id}")
  size = request.args.get('size', type=int)
  sigma = request.args.get('sigma', type=int)
  original = cv2.imread(f"../shared/{user_id}/temp/{filename}/original.{extension}")
  image = cv2.imread(f"../shared/{user_id}/temp/{filename}/original.{extension}", 0)
  image = resize(image, 2000)
  thumbnail = resize(original, 1000)
  cv2.imwrite(f"../shared/{user_id}/temp/{filename}/original.{extension}", original)
  kernel = genGaussianKernel(size, sigma)
  blurred_image = cv2.filter2D(image, -1, kernel)
  outline = cv2.subtract(blurred_image, image)
  details = cv2.subtract(image, blurred_image)
  cv2.imwrite(f"../shared/{user_id}/temp/{filename}/outline.{extension}", outline)
  cv2.imwrite(f"../shared/{user_id}/temp/{filename}/details.{extension}", details)
  cv2.imwrite(f"../shared/{user_id}/temp/{filename}/thumbnail.{extension}", thumbnail)
  return jsonify({"message": "success"})

@app.route("/get-picture-timerecords-chart", methods=["POST"])
def get_picture_timerecords_chart():
  body = request.get_json()
  user_id = body['user_id']
  picture_id = body['picture_id']
  cursor = mysql.connection.cursor()
  cursor.execute("call get_user_picture_time_records(%s, %s)", (user_id, picture_id))
  result = cursor.fetchall()
  N = len(result)
  x = [dt.datetime.strptime(str(record[2]), "%Y-%m-%d %H:%M:%S") for record in result]
  y = [record[1] for record in result]
  plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
  date_interval = max(1, int(N/10))
  plt.gca().xaxis.set_major_locator(mdates.DayLocator(interval=date_interval))
  formatter = ticker.FuncFormatter(lambda ms, y: time.strftime('%M:%S', time.gmtime(ms)))
  plt.gca().yaxis.set_major_formatter(formatter)
  plt.plot(x, y)
  plt.gcf().autofmt_xdate()
  temp_name = get_temp_name(user_id)
  plt.savefig(f"../shared/{user_id}/temp/{temp_name}.png")
  plt.close()
  return jsonify({"temp_name": temp_name})