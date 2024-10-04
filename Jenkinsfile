pipeline {
    agent any 

    environment {
        SCANNER_HOME = tool 'sonar' 
        NODE_HOME = tool name: 'NodeJS 14.21.3' 
        REPO_URL = 'https://github.com/CloudGeniuses/nodejsapps-cloudgenius.git'
        BRANCH_NAME = 'main'
        DOCKER_IMAGE = 'cloudgeniuslab/cloudgeniusvotinappnodejs:latest'
        AWS_REGION = 'us-east-2'
        SONARQUBE_SERVER = 'http://3.143.213.50:9000'
        SONARQUBE_PROJECT_KEY = 'project'
        SONARQUBE_TOKEN = credentials('sonartoken')
    }

    stages {
        stage('Checkout Code') {
            steps {
                git url: REPO_URL, branch: BRANCH_NAME
            }
        }

        stage('Check Node Version') {
            steps {
                script {
                    def nodeCmd = "${NODE_HOME}/bin/node"
                    sh "${nodeCmd} -v" // Check Node version
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    if (fileExists('package.json')) {
                        env.PATH = "${NODE_HOME}/bin:${env.PATH}"
                        def npmCmd = "${NODE_HOME}/bin/npm"
                        sh "${npmCmd} install"
                    } else {
                        error 'package.json not found. Cannot install dependencies.'
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    def npmCmd = "${NODE_HOME}/bin/npm"
                    if (fileExists('package.json')) {
                        if (sh(script: "${npmCmd} run test", returnStatus: true) != 0) {
                            error 'Tests failed.'
                        } else {
                            echo 'Tests passed.'
                        }
                    } else {
                        error 'package.json not found. Cannot run tests.'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    def npmCmd = "${NODE_HOME}/bin/npm"
                    if (fileExists('package.json')) {
                        if (sh(script: "${npmCmd} run build", returnStatus: true) != 0) {
                            error 'Build failed.'
                        } else {
                            echo 'Build completed successfully.'
                        }
                    } else {
                        error 'package.json not found. Cannot build the application.'
                    }
                }
            }
        }

        stage('Check for app.js') {
            steps {
                script {
                    if (!fileExists('app.js')) {
                        error 'app.js not found. This file is crucial for the application.'
                    } else {
                        echo 'app.js exists.'
                    }
                }
            }
        }

        stage('Static Code Analysis') {
            when {
                branch 'main'
            }
            steps {
                script {
                    def scannerHome = tool 'sonar'
                    env.PATH = "${scannerHome}/bin:${env.PATH}"

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

        stage('Docker Build and Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockertoken', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        // Log in to Docker
                        sh """
                        echo "Logging in to Docker..."
                        docker login -u \$DOCKER_USERNAME -p \$DOCKER_PASSWORD
                        echo "Building Docker image..."
                        docker build -t ${DOCKER_IMAGE} .
                        echo "Pushing Docker image..."
                        docker push ${DOCKER_IMAGE}
                        """
                    }
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'public/**', fingerprint: true // Adjust based on output location
            }
        }
    }

    post {
        always {
            cleanWs() // Cleanup workspace always
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
