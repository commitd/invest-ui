pipeline {
    agent { 
        docker {
            image 'node:8.11'
        }
    }
    environment {
        NEXUS_PASSWORD = credentials('NEXUS_PASSWORD')
        NEXUS_AUTH = credentials('NEXUS_AUTH')
        SONAR_PASSWORD = credentials('SONAR_PASSWORD')
    }

    stages {
        stage('env') {
            steps {
                notifyStarted()
                sh 'printenv'
            }
        }
        stage('globals') {
            steps {    
                sh 'yarn global add lerna'                
            }
        }
        stage('bootstrap') {
            steps {    
                sh 'yarn bootstrap'                
            }
        }
        stage('build') {
            steps {    
                sh 'yarn build'                
            } 
        }
    }
    post {
        success {
             notifySuccess()
        }
        unstable {
             notifyUnstable()
        }
        failure {
            notifyFailed()
        }
    }
}

def notifyBuild(String buildStatus = 'STARTED', String colorCode = '#5492f7', String notify = '') {

  def project = 'invest-js'
  def channel = "ci_invest"
  def base = "https://bitbucket.org/committed/${project}/commits/" 
  
  def commit = sh(returnStdout: true, script: 'git log -n 1 --format="%H"').trim()
  def link = "${base}${commit}" 
  def shortCommit = commit.take(6)
  def title = sh(returnStdout: true, script: 'git log -n 1 --format="%s"').trim()
  def subject = "<${link}|${shortCommit}> ${title}" 

  def summary = "${buildStatus}: Job <${env.RUN_DISPLAY_URL}|${env.JOB_NAME} [${env.BUILD_NUMBER}]>\n${subject} ${notify}"
  
  slackSend (channel: "#${channel}", color: colorCode, message: summary)

}

def author() {
  return sh(returnStdout: true, script: 'git log -n 1 --format="%an" | awk \'{print tolower($1);}\'').trim()
}

def notifyStarted() {
  notifyBuild()
}

def notifySuccess() {
  notifyBuild('SUCCESS', 'good')
}

def notifyUnstable() {
  notifyBuild('UNSTABLE', 'warning', "\nAuthor: @${author()} <${RUN_CHANGES_DISPLAY_URL}|Changelog>")
}

def notifyFailed() {
  notifyBuild('FAILED', 'danger', "\nAuthor: @${author()} <${RUN_CHANGES_DISPLAY_URL}|Changelog>")
}  
  