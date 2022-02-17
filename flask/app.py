# export FLASK_APP=app && export FLASK_ENV=development && python3 -m flask run -h localhost -p 3001

from flask import Flask, request
from flask import jsonify

app = Flask(__name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'};

@app.route("/get-picture-preview", methods=["POST"])
def get_picture_preview():
  print(request.files)
  return jsonify({"message": "Hello World!"})