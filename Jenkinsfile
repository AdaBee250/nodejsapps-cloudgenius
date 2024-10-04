pipeline {
    agent {
        docker {
            image 'sonarsource/sonar-scanner-cli:latest' // SonarQube scanner image
        }
    }

    environment {
        REPO_URL = 'https://github.com/CloudGeniuses/nodejsapps-cloudgenius.git'
        BRANCH_NAME = 'main'
        DOCKER_IMAGE = 'cloudgeniuslab/cloudgeniusvotinappnodejs'
        AWS_REGION = 'us-east-2'
        ECR_URI = '211125403425.dkr.ecr.us-east-2.amazonaws.com/cloudgenius'
        SONARQUBE_SERVER = 'http://3.143.213.50:9000'
        SONARQUBE_PROJECT_KEY = 'project'
        SONARQUBE_TOKEN = credentials('sonartoken')
        AWS_CREDENTIALS = credentials('aws-cred')
    }

    stages {
        stage('Checkout Code') {
            steps {
                git url: REPO_URL, branch: BRANCH_NAME
            }
        }

        stage('Static Code Analysis') {
            when {
                branch 'main'
            }
            steps {
                script {
                    withCredentials([string(credentialsId: 'sonartoken', variable: 'SONAR_TOKEN')]) {
                        sh """
                        sonar-scanner \
                            -Dsonar.projectKey=${SONARQUBE_PROJECT_KEY} \
                            -Dsonar.host.url=${SONARQUBE_SERVER} \
                            -Dsonar.login=\${SONAR_TOKEN} \
                            -Dsonar.projectVersion=${env.BUILD_NUMBER} \
                            -Dsonar.sources=.
                        """
                    }
                }
            }
        }

        // ... rest of your pipeline stages
    }

    post {
        success {
            echo 'Deployment completed successfully!'
        }
        failure {
            echo 'Deployment failed. Check the logs!'
        }
        always {
            cleanWs()
        }
    }
}
