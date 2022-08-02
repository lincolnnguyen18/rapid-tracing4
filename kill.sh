if ! screen -list | grep -q 'd9'; then
  echo 'd9 already killed'
  exit 1
else
  echo "killing d9"
fi
. /media/sda1/deployment/ports.sh
screen -S 'd9' -X quit
echo "Checking if d9 still alive..."
lsof -i:$d9

if ! screen -list | grep -q 'e2'; then
  echo 'e2 already killed'
  exit 1
else
  echo "killing e2"
fi
. /media/sda1/deployment/ports.sh
screen -S 'e2' -X quit
echo "Checking if e2 still alive..."
lsof -i:$e2