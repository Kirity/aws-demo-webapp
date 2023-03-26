| Resource name | Description|
| --- |--- |
| [CodeCommit](https://aws.amazon.com/codecommit/) | Serverless solution to securely host highly scalable private Git repositories and collaborate on code.|
| [CodePipeline](https://aws.amazon.com/codepipeline/) | Serverless solution to automate continuous delivery pipelines for fast and reliable updates.|
| [CodeBuild](https://aws.amazon.com/codebuild/) | Serverless solution to build and test the software with automatic scaling.|
| [CodeDeploy]() | test|
| [ECR]() | test|
| [S3]() | test|

# POC of a web app with full CI/CD implemented with ECS FARGATE

| S.No | CloudFormation stack | Description|
| --- | --- |--- |
| 1 | [Network infrastructure stack](https://github.com/Kirity/aws-demo-webapp/blob/feature_branch/infrastructure/aws-webapp-network-infrastructure.yaml) |VPC,|
| 2 | [ECS cluster stack]() |ECS Cluster with FARGATE|
| 3 | [Code infrastructure stack]() |S3 bucket|
| 4 | [Pipeline stack]() |CodePipeline with stages source, build, and deploy|

Successful stack creation   

![image](https://user-images.githubusercontent.com/15073157/227745524-e6b9715a-1187-4763-8a45-d80e789ab7a8.png)

Commit(`76b65d9`) to branch 'develop' will trigger the dev pipeline

![image](https://user-images.githubusercontent.com/15073157/227745338-43252e2b-20bb-4c21-b2ff-9462d9a317b9.png)

Commit `76b65d9` triggered the pipeline 

![image](https://user-images.githubusercontent.com/15073157/227745552-0ba1c3b7-bf8c-4a90-a912-2dff698099ed.png)

Showing the stages: Source, Build, and Deploy

![image](https://user-images.githubusercontent.com/15073157/227745564-9ff6cb46-0dfb-4865-9151-2d6d7a002396.png)
![image](https://user-images.githubusercontent.com/15073157/227745596-96442c71-1319-4da3-903b-1e3cae1f95ba.png)


ECR repository with docker images pushed into the dev repository

![image](https://user-images.githubusercontent.com/15073157/227747830-92d4404f-01c4-46f9-9809-1a82096c9a9e.png)


ECS cluster with service and 2 tasks

![image](https://user-images.githubusercontent.com/15073157/227745654-c42e0ee1-ec90-4c02-b303-f9fd13903f2a.png)

The provisioned ALB with CF

![image](https://user-images.githubusercontent.com/15073157/227745665-53c6153e-dc5a-4495-9698-3dad965dc1b4.png)

Accessing the webapp with ALB URL. Response from the first hostname

![image](https://user-images.githubusercontent.com/15073157/227745683-37acc4de-b457-4418-a734-675b528c3926.png)

Accessing the webapp with ALB URL. Response from the second hostname

![image](https://user-images.githubusercontent.com/15073157/227745694-360e63e8-aea5-4435-8272-e5e607d476b7.png)


# Architecture for an application with frontend, backend with ECS EC2
## Application and it's requirements
- Application has two services: frontend and backend. Both are containarized.
- Load balancer needs tobe used distribute traffic between frontend and backend.
- ECS with EC2 needs tobe used.
- Database used is RDS.
- It needs monitoring. 

## Environments

There are two options to set up the environments(dev/qa/prod):

Option-1 single account strategy: deploy all the resources in a single account, differentiating/identifying with name.

Option-2 multi account strategy: separate account for each environment. Use [AWS Organizations](https://aws.amazon.com/organizations/) to create separate account for each stage.  

Option-2 is recommendable. 


## Choice of services

### Choice of services to provision the application 

| Resource name | Description |
| --- | --- |
| [Route53](https://aws.amazon.com/route53/) | Highly available and scalable Domain Name System(DNS) |
| [VPC](https://docs.aws.amazon.com/vpc/index.html) | A virtual private cloud is a isolated cloud network, where in one can host one's cloud resources in a isolated space. Here we have to define a CIDR range.|
| [InternetGateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html) |By default any custom created VPC would not have internet access. This service would give the access to internet. IG will be attached to the VPC.|
| [Subnets](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html) | VPC is divided into many subnets. Subnets with internet connectivity are classified as public other are classified as private subnets. Resources provisioned in the private subnets cannot be reached from internet thereby reducing the attack surface.|
| [SecurityGroups](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) |It controls the inbound and outbound traffic on the resource that it is associated with. It provides a security layer to the resource it is associated with. |
| [IAM](https://aws.amazon.com/iam/) |Identity and access management service provided by AWS. To created needed users, roles, and polices.|
| [ALB](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html) | Application load balancer is used to distribute the incoming traffic to the instances registered in the linked auto scaling group. This would increase the availability of the application|
| [ACM](https://aws.amazon.com/certificate-manager/) |Used to provision and manage SSL/TLS certificates. ACM can be integrate with ALB to force the clients to use secure(https) connection to the application to achieve the encryption in transit. Also, SSL termination can be achieved at ALB.|
| [ASG](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html) |This a auto scaling group which contains a collection of EC2 instances that are treated as a logical grouping for the purpose of automatic scaling and management. We can define the launching template, min and max capacity for the expected demand. [Scaling polices](https://docs.aws.amazon.com/autoscaling/ec2/userguide/scale-your-group.html) can be set to scale-in or scale-out with in the set min and max limits. |
| [KMS](https://aws.amazon.com/kms/) |Service use to encrypt the data at rest for the resources like EBS volumes, RDS, and ElasticCache.|
| [ECS with EC2]() |ECS is a fully managed container orchestration service that makes it easy for you to deploy, manage, and scale containerized applications. Here ECS with [EC2 as launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html) is used to configure and deploy EC2 instances in the ECS cluster to run the containers. This type is suitable for workloads that require consistently high CPU core and memory usage, large workloads that need to be optimized for price, applications need to access persistent storage.  |
| [RDS Aurora](https://aws.amazon.com/rds/) |Amazon Relational Database Service (Amazon RDS) is a web service that makes it easier to set up, operate, and scale a relational database in the cloud. Amazon Aurora is a fully managed relational database engine that's built for the cloud and compatible with MySQL and PostgreSQL. [Amazon RDS Proxy](https://aws.amazon.com/rds/proxy/) can be used to increase the scalability and resiliency of application. [RDS Multi-AZ](https://aws.amazon.com/rds/features/multi-az/) capabilities can be used to increase the availability and durability of the DB.|
| [ElasticCache Redis](https://aws.amazon.com/elasticache/redis/global-datastore/?nc=sn&loc=3&dn=1) |Caching layer to improve the read latency of the application.|
| [Secrets Manager](https://aws.amazon.com/secrets-manager/) |Centrally manage the lifecycle of secrets. To store the RDS credentials. |
| [CloudFormation](https://aws.amazon.com/cloudformation/) |Serverless Infrastructure as code(IaC) solution in the AWS cloud. Used to provision the resources. |


### Choice of services to provision CI/CD workflow



### Choice of services to provision for monitoring 

| Resource name | Description|
| --- |--- |
| [CloudWatch Logs]() | test|
| [CloudWatch Alarms]() | test|
| [SNS]() | test|
| [SES]() | test|
