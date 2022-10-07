import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { 
  aws_ec2 as ec2,
  aws_iam as iam,
  aws_rds as rds,
  aws_iotsitewise as sitewise
} from 'aws-cdk-lib';
import { buildPostgresConnectionString } from '../utils/connection-string';


export class PrintsterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create IAM users with roles and policies
    const serviceRole = this.createServiceRole(); 
    const adminUser = this.createIamUser('PrintsterAdmin', 'Pass123!');
    const viewerUser = this.createIamUser('PrintsterViewer', 'Pass123!');
    this.createServicePolicy(serviceRole, [adminUser, viewerUser]);

    // create portal and access policies
    const portal = this.createPortal(serviceRole.roleArn);
    this.createPortalAccessPolicy(portal.attrPortalId, "PrintsterAdmin", adminUser.userArn, "ADMINISTRATOR");
    this.createPortalAccessPolicy(portal.attrPortalId, "PrintsterViewer", viewerUser.userArn, "VIEWER");
    this.createIsengardAccessPolicy(portal.attrPortalId);

    // create models and assets
    const printerModel = this.createModel('PrinterModel', [
      {
        logicalId: "ink-level",
        name: "Ink Level",
        dataType: "DOUBLE",
        type: {
          typeName: "Measurement"
        } 
      }
    ]);

    const printerAsset = this.createAsset('PrinterAsset', printerModel.attrAssetModelId, [
      {
        alias: "/printster/printer/1/ink-level",
        logicalId: "ink-level",
      }
    ]);
    
    // create database
    const vpc = this.createVpc();
    this.createDatabase(vpc);
  }

  createModel(name: string, properties: sitewise.CfnAssetModel.AssetModelPropertyProperty[]) {
     return new cdk.aws_iotsitewise.CfnAssetModel(this, name, {
      assetModelName: name,
      assetModelProperties: properties
    });
  }

  createAsset(name: string, modelId: string, properties: sitewise.CfnAsset.AssetPropertyProperty[]) {
    return new sitewise.CfnAsset(this, name, {
      assetName: name,
      assetModelId: modelId,
      assetProperties: properties
    });
  }

  createPortal(serviceRoleArn: string) {
    return new sitewise.CfnPortal(this, 'PrintsterPortal', {
      portalName: 'Printster',
      portalContactEmail: 'thjurane@amazon.com',
      roleArn: serviceRoleArn,
      portalAuthMode: "IAM",
    });
  }

   createPortalAccessPolicy(portalId: string, username: string, userArn: string, permission: "ADMINISTRATOR" | "VIEWER") {
    return new sitewise.CfnAccessPolicy(this, `PrintsterAccessPolicy-${username}`, {
      accessPolicyIdentity: {
        iamUser: {
          arn: userArn
        }
      },
      accessPolicyPermission: permission,
      accessPolicyResource: {
        portal: {
          id: portalId,
        },
      },
    });
  }

  createIsengardAccessPolicy(portalId: string) {
    return new sitewise.CfnAccessPolicy(this, `PrintsterAccessPolicy-IsengardAdmin`, {
      accessPolicyIdentity: {
        iamRole: {
          arn: "arn:aws:iam::971419634908:role/Admin" 
        }
      },
      accessPolicyPermission: "ADMINISTRATOR",
      accessPolicyResource: {
        portal: {
          id: portalId,
        },
      },
    });
  }

  createServiceRole() {
    return new iam.Role(this, 'AWSIoTSiteWiseMonitorServiceRole_Printster', {
      roleName: 'AWSIoTSiteWiseMonitorServiceRole_Printster',
      description: 'IAM user role to access the Sitewise Monitor service.',
      assumedBy: new iam.ServicePrincipal('monitor.iotsitewise.amazonaws.com'),
    });
  }

  createIamUser(username: string, password: string) {
    return new cdk.aws_iam.User(this, `PrintsterUser-${username}`, {
      userName: username,
      password: cdk.SecretValue.unsafePlainText(password),
      passwordResetRequired: false,
    });
  }

  createServicePolicy(serviceRole: iam.Role, users: iam.User[]) {
    return new iam.ManagedPolicy(this, 'Policy', {
      managedPolicyName: 'AWSIoTSiteWiseMonitorServiceRole_Printster',
      description: 'Allow users to access their portals.',
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            "iotsitewise:DescribePortal",
            "iotsitewise:CreateProject",
            "iotsitewise:DescribeProject",
            "iotsitewise:UpdateProject",
            "iotsitewise:DeleteProject",
            "iotsitewise:ListProjects",
            "iotsitewise:BatchAssociateProjectAssets",
            "iotsitewise:BatchDisassociateProjectAssets",
            "iotsitewise:ListProjectAssets",
            "iotsitewise:CreateDashboard",
            "iotsitewise:DescribeDashboard",
            "iotsitewise:UpdateDashboard",
            "iotsitewise:DeleteDashboard",
            "iotsitewise:ListDashboards",
            "iotsitewise:CreateAccessPolicy",
            "iotsitewise:DescribeAccessPolicy",
            "iotsitewise:UpdateAccessPolicy",
            "iotsitewise:DeleteAccessPolicy",
            "iotsitewise:ListAccessPolicies",
            "iotsitewise:DescribeAsset",
            "iotsitewise:ListAssets",
            "iotsitewise:ListAssociatedAssets",
            "iotsitewise:DescribeAssetProperty",
            "iotsitewise:GetAssetPropertyValue",
            "iotsitewise:GetAssetPropertyValueHistory",
            "iotsitewise:GetAssetPropertyAggregates",
            "iotsitewise:BatchPutAssetPropertyValue",
            "iotsitewise:ListAssetRelationships",
            "iotsitewise:DescribeAssetModel",
            "iotsitewise:ListAssetModels",
            "iotsitewise:UpdateAssetModel",
            "iotsitewise:UpdateAssetModelPropertyRouting",
            "sso-directory:DescribeUsers",
            "sso-directory:DescribeUser",
            "iotevents:DescribeAlarmModel",
            "iotevents:ListTagsForResource"
          ],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            "iotevents:BatchAcknowledgeAlarm",
            "iotevents:BatchSnoozeAlarm",
            "iotevents:BatchEnableAlarm",
            "iotevents:BatchDisableAlarm"
          ],
          resources: ['*'],
          conditions: {
            "Null": {
              "iotevents:keyValue": "false"
            }
          }
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            "iotevents:CreateAlarmModel",
            "iotevents:TagResource"
          ],
          resources: ['*'],
          conditions: {
            "Null": {
              "aws:RequestTag/iotsitewisemonitor": "false"
            }
          }
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            "iotevents:UpdateAlarmModel",
            "iotevents:DeleteAlarmModel"
          ],
          resources: ['*'],
          conditions: {
            "Null": {
              "aws:ResourceTag/iotsitewisemonitor": "false"
            }
          }
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            "iam:PassRole"
          ],
          resources: ['*'],
          conditions: {
            "StringEquals": {
              "iam:PassedToService": [
                  "iotevents.amazonaws.com"
              ]
            }
          }
        }),
      ], 
      roles: [serviceRole],
      users
    });
  }

  /**
   * Creates a virtual private cloud to add all prinster infrastructure to.
   */
  createVpc() {
    return new ec2.Vpc(this, 'Printster-Vpc', {
      cidr: '10.0.0.0/16',
      natGateways: 0,
      maxAzs: 3,
      subnetConfiguration: [
        {
          name: 'printster-public-subnet',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'printster-private-subnet',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 28,
        },
      ],
    });
  }

  /**
   * Creates a postgres database instance that is public, destroyable, doesn't have
   * backups, and has a small storage size. 
   * 
   * We're optimizing for creation time and testing data, not production readiness
   * or availability.
   */
  createDatabase(vpc: ec2.Vpc) {
    const constants = {
      databaseName: 'printster',
      databaseUsername: 'postgres',
      databasePassword: 'Pass123!'
    }

    const database = new rds.DatabaseInstance(this, 'Prinster-Database', {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_14_3,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.MICRO,
      ),
      credentials: rds.Credentials.fromPassword(constants.databaseUsername, cdk.SecretValue.unsafePlainText(constants.databasePassword)),
      multiAz: false,
      allocatedStorage: 10,
      maxAllocatedStorage: 15,
      allowMajorVersionUpgrade: false,
      autoMinorVersionUpgrade: true,
      backupRetention: cdk.Duration.days(0),
      deleteAutomatedBackups: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      deletionProtection: false,
      databaseName: 'printster',
      publiclyAccessible: true,
    });

    database.connections.allowFromAnyIpv4(ec2.Port.allTraffic());

    new cdk.CfnOutput(this, 'databaseConnectionString', {
      description: 'Postgres connection string for the database.',
      exportName: 'databaseConnectionString',
      value: buildPostgresConnectionString(
        constants.databaseUsername,
        constants.databasePassword,
        database.instanceEndpoint.socketAddress,
        constants.databaseName
      )
    });

    return database;
  }

  createGateway() {
    new sitewise.CfnGateway(this, 'Printster-IoT-Gateway', {
      gatewayName: 'Printster-IoT-Gateway',
      gatewayPlatform: {
        greengrassV2: {
          coreDeviceThingName: 'Printster-IoT-Gateway-Thing',
        },
      } 
    });
  }
}