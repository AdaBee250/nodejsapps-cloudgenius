pipeline {
    agent any
    environment {
        REPO_URL = 'https://github.com/CloudGeniuses/nodejsapps-cloudgenius.git'
        BRANCH_NAME = 'main' // Change if you need a different branch
    }
    stages {
        stage('Checkout') {
            steps {
                script {
                    // Using the Git plugin for a clean checkout
                    git branch: "${env.BRANCH_NAME}", url: "${env.REPO_URL}"
                }
            }
        }
        // Additional stages can go here
    }
}
