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
        
        
    }
}
