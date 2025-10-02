cd jenkins_server
docker compose up -d

echo "------> Jenkins started in: http://localhost:8080"
echo "..."
sleep 5
echo "------> First Access Pass"
docker exec -it local-jenkins cat /var/jenkins_home/secrets/initialAdminPassword

echo "✅ All done. Jenkis is ready to use."