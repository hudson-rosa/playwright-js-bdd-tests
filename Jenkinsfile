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





pipeline {
  agent any

  parameters {
    booleanParam(name: 'OPEN_ALLURE', defaultValue: false, description: 'Enable Allure report generation?')
    choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit', 'all'], description: 'Browser to test with')
    booleanParam(name: 'HEADLESS', defaultValue: true, description: 'Run in headless mode?')
    choice(name: 'TAG', choices: ['@smoke', '@regression'], description: 'Which tag to run?')
  }

  environment {
    COMPOSE_FILE = 'docker-compose.yml'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Run Tests with Docker Compose') {
      steps {
        script {
          def allureFlag = params.OPEN_ALLURE.toString().toLowerCase()
          def headlessFlag = params.HEADLESS.toString().toLowerCase()

          sh """
            docker-compose down || true
            docker-compose up --build --abort-on-container-exit --exit-code-from tests \
              --env-file .env \
              tests
          """
        }
      }
    }
  }

  post {
    always {
      echo '📦 Cleaning up Docker containers...'
      sh 'docker-compose down --remove-orphans'
    }
  }
}






pipeline {
  agent any

  // default parameter values
  environment {
    BROWSER = 'chromium'
    HEADLESS = 'true'   
    TAG = '@smoke-test' 
    OPEN_ALLURE = 'true'
  }

  parameters {
    string(name: 'BROWSER', defaultValue: 'chromium', description: 'Browser to run: chromium, firefox, webkit, all')
    string(name: 'HEADLESS', defaultValue: 'true', description: 'Run headless: true or false')
    string(name: 'TAG', defaultValue: '@regression', description: 'Cucumber tag to run')
    booleanParam(name: 'OPEN_ALLURE', defaultValue: true, description: 'Generate Allure report?')
  }

  stages {
    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Run Tests in Docker') {
      steps {
        script {
          // Run docker-compose with environment overrides
          sh """
            docker-compose run --rm \
              -e BROWSER=${params.BROWSER} \
              -e HEADLESS=${params.HEADLESS} \
              -e TAG="${params.TAG}" \
              -e OPEN_ALLURE=${params.OPEN_ALLURE} \
              tests
          """
        }
      }
    }

    stage('Archive Allure Results') {
      when {
        expression { return params.OPEN_ALLURE }
      }
      steps {
        allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
      }
    }
  }

  post {
    always {
      echo 'Cleaning up...'
      sh 'docker-compose down --remove-orphans'
    }
  }
}