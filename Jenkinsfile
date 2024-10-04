pipeline {
    agent any

    environment {
        REPO_URL = 'https://github.com/CloudGeniuses/nodejsapps-cloudgenius.git'
        BRANCH_NAME = 'main' // Change if you need a different branch
        DOCKER_IMAGE = 'cloudgeniuslab/cloudgeniusvotinappnodejs' // Updated Docker image name
        AWS_REGION = 'us-east-2' // Updated AWS region
        ECR_URI = '211125403425.dkr.ecr.us-east-2.amazonaws.com/cloudgenius' // Updated ECR URI
        SONARQUBE_SERVER = 'http://3.143.213.50:9000' // Updated SonarQube server URL
        SONARQUBE_PROJECT_KEY = 'project' // Updated project key
        SONARQUBE_TOKEN = credentials('sonartoken') // Updated SonarQube token credentials ID
        AWS_CREDENTIALS = credentials('aws-cred') // Updated AWS credentials ID
    }

    stages {
        stage('Checkout Code') {
            steps {
                git url: REPO_URL, branch: BRANCH_NAME
            }
        }

        stage('Static Code Analysis') {
            when {
                branch 'main' // Only run on the main branch
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

        stage('Build & Test') {
            parallel {
                stage('Build Docker Image') {
                    steps {
                        script {
                            withCredentials([AWS_CREDENTIALS]) {
                                sh """
                                aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_URI}
                                docker build -t ${DOCKER_IMAGE} .
                                docker tag ${DOCKER_IMAGE}:latest ${ECR_URI}:latest
                                """
                            }
                        }
                    }
                }
                stage('Run Tests') {
                    steps {
                        sh 'npm install && npm test'
                    }
                }
            }
        }

        stage('Push Docker Image to ECR') {
            steps {
                script {
                    sh "docker push ${ECR_URI}:latest"
                }
            }
        }

        // Commented out the Deploy to EKS stage
        /*
        stage('Deploy to EKS') {
            steps {
                script {
                    withCredentials([AWS_CREDENTIALS]) {
                        sh """
                        aws eks --region ${AWS_REGION} update-kubeconfig --name your-cluster-name
                        # kubectl set image deployment/${K8S_DEPLOYMENT} ${K8S_DEPLOYMENT}=${ECR_URI}:latest // Uncomment this line if needed
                        # kubectl rollout status deployment/${K8S_DEPLOYMENT} // Uncomment this line if needed
                        """
                    }
                }
            }
        }
        */

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
