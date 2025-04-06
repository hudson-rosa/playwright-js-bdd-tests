pipeline {
  agent any

  environment {
    COMPOSE_PROJECT_NAME = "playwright-bdd"
  }

  stages {
    stage('Checkout Code') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'docker-compose run --rm tests npm ci'
      }
    }

    stage('Run Tests in All Browsers') {
      steps {
        sh 'docker-compose up --abort-on-container-exit'
      }
    }

    stage('Generate HTML Report') {
      steps {
        // Just to ensure the report generation in case test container finished
        sh 'docker-compose run --rm tests npm run generate:report'
      }
    }
  }

  post {
    always {
      // Clean up containers
      sh 'docker-compose down -v'

      // Archive the test results
      archiveArtifacts artifacts: 'reports/**/*.json', fingerprint: true

      // Publish the HTML test report
      publishHTML([target: [
        reportName: 'Cucumber HTML Report',
        reportDir: 'reports/html',
        reportFiles: 'index.html',
        keepAll: true,
        alwaysLinkToLastBuild: true,
        allowMissing: false
      ]])
    }
  }
}
