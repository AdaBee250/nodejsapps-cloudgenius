pipeline {
    agent any // Use any available agent

    environment {
        SCANNER_HOME = tool 'sonar' // Use the configured SonarQube Scanner
        NODE_HOME = tool name: 'nodejs', type: 'NodeJSInstallation'
        REPO_URL = 'https://github.com/CloudGeniuses/nodejsapps-cloudgenius.git'
        BRANCH_NAME = 'main'
        DOCKER_IMAGE = 'cloudgeniuslab/cloudgeniusvotinappnodejs'
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

        stage('Install Dependencies') {
            steps {
                script {
                    // Ensure package.json exists before installing
                    if (fileExists('package.json')) {
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
                    // Check if tests are defined in package.json and run them
                    def npmCmd = "${NODE_HOME}/bin/npm"
                    if (fileExists('package.json')) {
                        // Run tests
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
                    // Ensure build script is defined in package.json
                    def npmCmd = "${NODE_HOME}/bin/npm"
                    if (fileExists('package.json')) {
                        // Run build process
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
                    // Ensure app.js exists
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
                    def scannerHome = tool 'sonar' // Using the correct tool name
                    env.PATH = "${scannerHome}/bin:${env.PATH}" // Ensure the scanner is in the PATH

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

        stage('Archive Artifacts') {
            steps {
                // Archive the built application or artifacts
                archiveArtifacts artifacts: 'public/**', fingerprint: true // Adjust based on output location
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
        always {
            cleanWs()
        }
    }
}
