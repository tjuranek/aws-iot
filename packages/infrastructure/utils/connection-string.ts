/**
 * 
 */
export function buildPostgresConnectionString(username: string, password: string, socketAddress: string, databaseName: string) {
    return `postgresql://${username}:${password}@${socketAddress}/${databaseName}?schema=public`;

}