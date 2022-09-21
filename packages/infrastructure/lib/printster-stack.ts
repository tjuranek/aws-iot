import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { 
  aws_ec2 as ec2,
  aws_rds as rds,
} from 'aws-cdk-lib';
import { buildPostgresConnectionString } from '../utils/connection-string';

const constants = {
  databaseName: 'printster',
  databaseUsername: 'postgres',
  databasePassword: 'Pass123!'
}

export class PrintsterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = this.createVpc();
    const database = this.createDatabase(vpc);

    new cdk.CfnOutput(this, 'DatabaseConnectionString', {
      description: 'Postgres connection string for the database.',
      exportName: 'databaseConnectionString',
      value: buildPostgresConnectionString(
        constants.databaseUsername,
        constants.databasePassword,
        database.instanceEndpoint.socketAddress,
        constants.databaseName
      )
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

    return database;
  }
}
