Welcome to the AWS CodeStar sample web service
==================================================

This sample code helps get you started with a simple Java web service
deployed by AWS CodeDeploy to an Amazon EC2 server.

What's Here
-----------

This sample includes:

* README.md - this file
* appspec.yml - this file is used by AWS CodeDeploy when deploying the web
  service to EC2
* buildspec.yml - this file is used by AWS CodeBuild to build the web
  service
* pom.xml - this file is the Maven Project Object Model for the web service
* src/ - this directory contains your Java service source files
* scripts/ - this directory contains scripts used by AWS CodeDeploy when
  installing and deploying your service on the Amazon EC2 instance


Getting Started
---------------

These directions assume you want to develop on your local computer, and not
from the Amazon EC2 instance itself. If you're on the Amazon EC2 instance, the
virtual environment is already set up for you, and you can start working on the
code.

To work on the sample code, you'll need to clone your project's repository to your
local computer. If you haven't, do that first. You can find instructions in the
AWS CodeStar user guide.

1. Install maven.  See https://maven.apache.org/install.html for details.

2. Install tomcat.  See https://tomcat.apache.org/tomcat-7.0-doc/setup.html for
   details.

3. Build the service.

        $ mvn -f pom.xml compile
        $ mvn -f pom.xml package

4. Copy the built service to the Tomcat webapp directory.  The actual
   location of that directory will vary depending on your platform and
   installation.

        $ cp target/ROOT.war <tomcat webapp directory>

4. Restart your tomcat server

5. Open http://127.0.0.1:8080/ in a web browser to view your service.

What Do I Do Next?
------------------

Once you have a virtual environment running, you can start making changes to
the sample Java web service. We suggest making a small change to
/src/main/java/com/aws/codestar/projecttemplates/controller/HelloWorldController.java
first, so you can see how changes pushed to your project's repository are automatically
picked up by your project pipeline and deployed to the Amazon EC2 instance. (You can watch
the pipeline progress on your project dashboard.) Once you've seen how that works, start
developing your own code, and have fun!

Learn more about AWS CodeStar by reading the user guide. Ask questions or make
suggestions on our forum.

User Guide: http://docs.aws.amazon.com/codestar/latest/userguide/welcome.html

Forum: https://forums.aws.amazon.com/forum.jspa?forumID=248
