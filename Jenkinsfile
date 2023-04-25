pipeline {
    environment {
        IMAGE_NAME = "test1"
        IMAGE_TAG = "latest"
        STAGING = "test1-staging"
        PRODUCTION = "test1-production"
    }
    agent none
    stages {
        stage('Build image') {
            agent any
            steps {
                script {
                    sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
                }
            }
        }
        stage('Test image') {
            agent any
            steps {
                script {
                    sh '''
                        docker run --rm -d -p 8081:80 $IMAGE_NAME:$IMAGE_TAG
                        sleep 5
                        curl http://192.168.56.8:8081 | grep -q "Welcome to test1"
                    '''
                }
            }
        }
        stage('Clean image') {
            agent any
            steps {
                script {
                    sh 'docker stop $IMAGE_NAME:$IMAGE_TAG || true && docker rm $IMAGE_NAME:$IMAGE_TAG || true'
                }
            }
        }
        stage('Push to staging') {
            when {
                expression { GIT_BRANCH == 'origin/main' }
            }
            agent any
            environment {
                HEROKU_API_KEY = credentials('heroku_api_key')
            }
            steps {
                script {
                    sh '''
                        heroku container:login
                        heroku create $STAGING || echo "project already exists"
                        heroku container:push -a $STAGING web
                        heroku container:release -a $STAGING web
                    '''
                }
            }
        }
        stage('Push to production') {
            when {
                expression { GIT_BRANCH == 'origin/main' }
            }
            agent any
            environment {
                HEROKU_API_KEY = credentials('heroku_api_key')
            }
            steps {
                script {
                    sh '''
                        heroku container:login
                        heroku create $PRODUCTION || echo "project already exists"
                        heroku container:push -a $PRODUCTION web
                        heroku container:release -a $PRODUCTION web
                    '''
                }
            }
        }
    }
}
