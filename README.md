# POC of a web app with full CI/CD implemented with ECS launch type as FARGATE

| S.No | CloudFormation stack | Description|
| --- | --- |--- |
| 1 | [Network infrastructure stack](https://github.com/Kirity/aws-demo-webapp/blob/develop/infrastructure/aws-webapp-network-infrastructure.yaml) |Provisions  `VPC`, `InternetGateway`, `public-subnets`, `private-subnets`. |
| 2 | [ECS cluster stack](https://github.com/Kirity/aws-demo-webapp/blob/develop/infrastructure/ecs-cluster.yaml) |Provisions needed `IAM roles`, `ALB security group`, `ALB`,  `ECS` Cluster with FARGATE. |
| 3 | [Code infrastructure stack](https://github.com/Kirity/aws-demo-webapp/blob/develop/infrastructure/web-app-code-infrastructure.yaml) |Provisions a `S3` bucket to store the build artifacts.|
| 4 | [Pipeline stack](https://github.com/Kirity/aws-demo-webapp/blob/develop/infrastructure/web-app-pipeline.yaml) |Provisions `CodePipeline` with stages source, build, and deploy.|

### Screenshots of deployment and working POC

Successful creation of CloudFormation stacks.   

![image](https://user-images.githubusercontent.com/15073157/227745524-e6b9715a-1187-4763-8a45-d80e789ab7a8.png)

Commit(`76b65d9`) to the branch 'develop' will trigger the dev pipeline.

![image](https://user-images.githubusercontent.com/15073157/227745338-43252e2b-20bb-4c21-b2ff-9462d9a317b9.png)

Commit `76b65d9` triggered the dev pipeline .

![image](https://user-images.githubusercontent.com/15073157/227745552-0ba1c3b7-bf8c-4a90-a912-2dff698099ed.png)

Showing the stages: Source, Build, and Deploy.

![image](https://user-images.githubusercontent.com/15073157/227745564-9ff6cb46-0dfb-4865-9151-2d6d7a002396.png)
![image](https://user-images.githubusercontent.com/15073157/227745596-96442c71-1319-4da3-903b-1e3cae1f95ba.png)


ECR repository with docker images pushed into the dev ECR repository.

![image](https://user-images.githubusercontent.com/15073157/227747830-92d4404f-01c4-46f9-9809-1a82096c9a9e.png)


ECS cluster with a service and two tasks.

![image](https://user-images.githubusercontent.com/15073157/227745654-c42e0ee1-ec90-4c02-b303-f9fd13903f2a.png)

The provisioned Application Load Balancer(ALB).

![image](https://user-images.githubusercontent.com/15073157/227745665-53c6153e-dc5a-4495-9698-3dad965dc1b4.png)

Accessing the webapp with ALB URL. Response from the first hostname.

![image](https://user-images.githubusercontent.com/15073157/227745683-37acc4de-b457-4418-a734-675b528c3926.png)

Accessing the webapp with ALB URL. Response from the second hostname.

![image](https://user-images.githubusercontent.com/15073157/227745694-360e63e8-aea5-4435-8272-e5e607d476b7.png)



# Architecture for an application with frontend and  backend services deployed with ECS EC2

## Application and it's requirements
- Application has two services: frontend and backend. Both are containarized.
- Load balancer needs to be used distribute traffic between frontend and backend.
- ECS with EC2 needs tobe used.
- Database used is RDS.
- It needs monitoring. 

## Environments setup

There are two options to set up the environments(dev/qa/prod):

Option-1 single account strategy: deploy all the resources in a single account, differentiating/identifying with name.

Option-2 multi account strategy: separate account for each environment. Use [AWS Organizations](https://aws.amazon.com/organizations/) to create separate account for each stage.  

Option-2 is recommendable. 

## Proposed architecture

![image](https://user-images.githubusercontent.com/15073157/228323572-e57b4d30-e79d-49e3-9a4c-17c4d158f6aa.png)


## Choice of services

### Choice of services to provision the application 

| Resource name | Description |
| --- | --- |
| [Route53](https://aws.amazon.com/route53/) | Highly available and scalable Domain Name System(DNS). To link the a static URL with the application IP address. |
| [VPC](https://docs.aws.amazon.com/vpc/index.html) | A virtual private cloud is a isolated cloud network, where in one can host the cloud resources in an isolated logical network space. Here we have to define a CIDR range.|
| [InternetGateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html) |By default any custom created VPC would not have internet access. This service would give the access to internet. IG will be attached to the VPC.|
| [Subnets](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html) | VPC is divided into many subnets. Subnets with internet connectivity are classified as public other are classified as private subnets. Resources provisioned in the private subnets cannot be reached from internet thereby reducing the attack surface.|
| [SecurityGroups](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) |It controls the inbound and outbound traffic on the resource that it is associated with. It provides a security layer to the resource it is associated with. |
| [IAM](https://aws.amazon.com/iam/) |Identity and access management service provided by AWS. To provision the needed users, roles, and polices.|
| [ALB](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html) | Application Load Balancer(ALB) is used to distribute the incoming traffic to the instances registered in the linked Auto Scaling Group(ASG). This would increase the availability and make the application fault tolerant.|
| [ACM](https://aws.amazon.com/certificate-manager/) |Used to provision and manage SSL/TLS certificates. ACM can be integrate with ALB to force the clients to use secure(https) connection to the application to achieve the encryption in transit. Also, SSL termination can be achieved at ALB.|
| [ASG](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html) |This a auto scaling group which contains a collection of EC2 instances that are treated as a logical grouping for the purpose of automatic scaling and management. We can define the launching template, min and max capacity for the expected demand. [Scaling polices](https://docs.aws.amazon.com/autoscaling/ec2/userguide/scale-your-group.html) can be configured to scale-in and scale-out with in the set min and max limits. |
| [KMS](https://aws.amazon.com/kms/) |Service use to encrypt the data at rest for the resources like EBS volumes, RDS, and ElasticCache.|
| [ECS with EC2]() |ECS is a fully managed container orchestration service that makes it easy to deploy, manage, and scale containerized applications. Here ECS with [EC2 as launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html) is used to configure and deploy EC2 instances in the ECS cluster to run the containers. This type is suitable for workloads that require consistently high CPU core and memory usage, large workloads that need to be optimized for price, applications which need to access persistent storage.  |
| [RDS Aurora](https://aws.amazon.com/rds/) |Amazon Relational Database Service (Amazon RDS) is a web service that makes it easier to set up, operate, and scale a relational database in the cloud. Amazon Aurora is a fully managed relational database engine that's built for the cloud and compatible with MySQL and PostgreSQL. [Amazon RDS Proxy](https://aws.amazon.com/rds/proxy/) can be used to increase the scalability and resiliency of application. [RDS Multi-AZ](https://aws.amazon.com/rds/features/multi-az/) capabilities can be used to increase the availability and durability of the DB.|
| [ElasticCache Redis](https://aws.amazon.com/elasticache/redis/global-datastore/?nc=sn&loc=3&dn=1) |Caching layer to improve the read latency of the application.|
| [Secrets Manager](https://aws.amazon.com/secrets-manager/) |Centrally manage the lifecycle of secrets. To store the RDS credentials. |
| [CloudFormation](https://aws.amazon.com/cloudformation/) |Serverless Infrastructure as code(IaC) solution in the AWS cloud. Used to provision the resources. |


### Choice of services for the CI/CD workflow

| Resource name | Description|
| --- |--- |
| [CodeCommit](https://aws.amazon.com/codecommit/) | Serverless solution to securely host highly scalable private Git repositories and collaborate on code.|
| [CodePipeline](https://aws.amazon.com/codepipeline/) | Serverless solution to automate continuous delivery pipelines for fast and reliable updates.|
| [CodeBuild](https://aws.amazon.com/codebuild/) | Serverless solution to build and test the software with automatic scaling.|
| [CodeDeploy](https://aws.amazon.com/codedeploy/) | Serverless solution to automate code deployment to maintain application uptime.|
| [ECR](https://aws.amazon.com/ecr/) | Serverless container registry to easily store, share, and deploy containers into ECS|
| [S3](https://aws.amazon.com/s3/) | Highly scalable, highly available serverless object storage service to store the build artifacts produced by [CodePipeline](https://aws.amazon.com/codepipeline/)|


### Choice of services for the monitoring purposes 

| Resource name | Description|
| --- |--- |
| [CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) | Serverless solution to store, monitor, and access the logs produced by various AWS services. It is integrated with many services like EC2, ECS, RDS, ElasticCache, ALB, CodePipeline, and Route53.|
| [CloudWatch Alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html) | It is the feature available in [CloudWatch](https://aws.amazon.com/cloudwatch/). Used to trigger and invoke actions on services like auto scaling group using [CloudWatch metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html). To monitor application logs and raise alarms and notifications. |
| [SNS](https://aws.amazon.com/sns/) | Fully managed Pub/Sub service sends notifications/messages to applications or to persons. Can be configured to send SMS texts, push notifications, and emails.|


## Cost estimation of the proposed architecture

### Fixed costs
| Service | Quantity |USD/month|
| --- |--- |--- |
| Route53| 1| 0.5|
| EC2, instance type: m5.xlarge| 4| 662|
| EBS General Purpose SSD (gp3) - Storage. 8 GB| 4| 3|
| Aurora MySQL-Compatible(db.r4.2xlarge)| 2 | 2044|
| Redis cache. Type: cache.m5.xlarge| 2| 541|

### Variable costs
| Service | Quantity |USD/month|
| --- |--- |--- |
| Frontend ALB| estimated| 30|
| Backend ALB| estimated| 30|
| NAT Gateway| estimated| 33|
|NAT Gateway data processing of 300 GB/month| estimated| 14|
|CodeBuild, instance type: general1.large| 1000 min| 20|
|ECR|40GB |6 |
|SecretsManager| 3 secrets, 10M requests|51 |
|CloudWatch| | |
|S3| | |
|SNS| | |
|KMS| | | 
 
 
## Further discussions
##### Handling sudden surge in load while maintaining performance and availability?

Services like Route53, InternetGateway, NAT Gateway, ALB are serverless meaning these would scale automatically.

Since ECS with EC2 is used we need to plan for sudden surges. To achieve this scaling polices needs to be configured to the ASG's like target tracking, step scaling, or simple scaling polices.

RDS Aurora supports auto scaling for the read replicas.    

##### Deployment and testing the infrastructure?

Deployment can be done in one of the ways: AWS Console, AWS CLI, and with CI/CD pipeline.

Example command to deploy with CLI as below:

`aws cloudformation deploy --template-file ./infrastructure/aws-webapp-network-infrastructure.yaml --stack-name aws-webapp-network-infrastructure --region=eu-central-1 --profile dev`

Before deploying the infrastructure testing can be done in the following ways:

- Compilation checks: using `aws cloudformation validate-template --template-body file://sampletemplate.json`
- Validate and catch common errors: using [cfn-lint](https://github.com/aws-cloudformation/cfn-lint). Usage `cfn-lint template.yaml`
- Creation of change sets(like dry-run or terraform plan): it’s AWS way of generating a preview of what the stack update will do. Usage `aws cloudformation create-change-set \

##### Security best practices?

- Use ACM along with ALB to force only HTTPS client communication.
- Allow ingress requests only from frontend-ALB-security-group to the frontend-ecs-service. This will reduce the attack surface. 
- Use encryption at rest where ever possible(EBS, RDS, CloudWatch logs).
- Use IAM roles to access any resources from EC2. 
- Do not use access-key-id and secret-access-key in EC2 instead use Secrets Manager to store and read passwords.   
- Create the IAM roles with the "least privilege principle".  
- Configure [AWS Shield](https://aws.amazon.com/shield/) for the DDOS protection.
- To be prepared for the incident management: enable the CloudTrail and VPC flow logs.


##### Deployment of new version of software with zero-downtime?
- Use CodeDeploy Blue/Green  to be more resilient and high availability

