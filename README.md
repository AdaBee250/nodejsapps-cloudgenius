On the jenkins server

docker build -t ooo:latest

docker run -d -p 3077:3077 --name container sss

sudo usermod -aG docker jenkins

sudo systemctl restart jenkins


