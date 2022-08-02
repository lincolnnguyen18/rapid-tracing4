. /media/sda1/deployment/ports.sh

if screen -list | grep -q "d9"; then
  echo "d9 already started"
  exit 1
else
  echo "starting d9"
fi

# Start node server
screen -dmS 'd9'
screen -S 'd9' -X stuff "node .\n"

echo "Checking if node started..."
lsof -i:$d9

if screen -list | grep -q "e2"; then
  echo "e2 already started"
  exit 1
else
  echo "starting e2"
fi

# Start node server
screen -dmS 'e2'
screen -S 'e2' -X stuff "cd flask && export FLASK_APP=app && export FLASK_ENV=development && python3 -m flask run -h localhost -p 8001\n"

echo "Checking if node started..."
lsof -i:$e2