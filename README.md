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

Resources needed to provision the application 
| Resource name | Description|
| --- |--- |
| [Route53]() | test|
| [VPC]() ||
| [Subnets]() ||
| [SecurityGroups]() ||
| [IAM]() ||
| [ALB]() ||
| [ACM]() ||
| [ASG]() ||
| [TargetGroups]() ||
| [KMS]() ||
| [ElasticCache]() ||
| [RDS]() ||

Resources needed to provision CI/CD workflow

| Resource name | Description|
| --- |--- |
| [CodePipeline]() | test|
| [CodeCommit]() | test|
| [ECR]() | test|
| [S3]() | test|

Resources needed to provision for monitoring

| Resource name | Description|
| --- |--- |
| [CloudWatch Logs]() | test|
| [CloudWatch Alarms]() | test|
| [SNS]() | test|
| [SES]() | test|
