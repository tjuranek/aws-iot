import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CountCard } from "~/components/CountCard";
import { getEmployeeCount } from "~/models/employee.server";
import { getMachineCount } from "~/models/machines.server";

export async function loader() {
    const employeeCount = await getEmployeeCount();
    const machineCount = await getMachineCount();

    return json({ employeeCount, machineCount });
}

export default function Dashboard() {
    const { employeeCount, machineCount } = useLoaderData<typeof loader>();

    return (
        <div className="flex gap-2">
            <div className="grow">
                <CountCard count={employeeCount} title={'Employee Count'} />
            </div>

            <div className="grow">
                <CountCard count={5} title={'Job Count'} />
            </div>

            <div className="grow">
                <CountCard count={machineCount} title={'Machine Count'} />
            </div>
        </div>
    );
}